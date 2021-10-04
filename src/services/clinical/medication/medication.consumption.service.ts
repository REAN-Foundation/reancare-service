import { inject, injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { Logger } from "../../../common/logger";
import { TimeHelper } from "../../../common/time.helper";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/patient/patient.repo.interface";
import { MedicationConsumptionDomainModel } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto, SchedulesForDayDto, SummarizedScheduleDto, SummaryForDayDto, SummaryForMonthDto } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionStatus } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types";
import { MedicationDto } from "../../../domain.types/clinical/medication/medication/medication.dto";
import { MedicationSearchFilters, MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';
import { MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from "../../../domain.types/clinical/medication/medication/medication.types";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionService {

    constructor(
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,

        //@inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
    ) {}

    create = async (medication: MedicationDto, customStartDate = null): Promise<MedicationConsumptionDto[]> => {

        var timeZone = await this.getPatientTimeZone(medication.PatientUserId);
        if (timeZone == null) {
            timeZone = "+05:30";
        }

        var scheduleTimings = this.getScheduleSlots(medication);
        var startDate = customStartDate ? customStartDate : medication.StartDate;
        if (startDate == null) {
            throw new ApiError(422, 'Medication consumption instances cannot be added as start date is invalid.');
        }
        
        var duration = medication.Duration;
        var durationUnit = medication.DurationUnit;
        var frequency = medication.Frequency;
        var frequencyUnit = medication.FrequencyUnit;
        var dose = medication.Dose;
        var dosageUnit = medication.DosageUnit;
        var refills = medication.RefillCount;

        var days = this.getDurationInDays(duration, durationUnit, refills);
        var dayStep = this.getDayStep(frequency, frequencyUnit);

        var consumptions: MedicationConsumptionDto[] = [];
        var i = 0;
        while (i < days) {

            var day = TimeHelper.addDuration(startDate, i, DurationType.Days);

            for (var j = 0; j < scheduleTimings.length; j++) {

                var details = this.getMedicationDetails(dose, dosageUnit, scheduleTimings[j].schedule);
                var start_minutes = scheduleTimings[j].start;
                var end_minutes = scheduleTimings[j].end;
                var start = TimeHelper.addDuration(day, start_minutes, DurationType.Minutes);
                var end = TimeHelper.addDuration(day, end_minutes, DurationType.Minutes);

                var domainModel: MedicationConsumptionDomainModel = {
                    PatientUserId     : medication.PatientUserId,
                    MedicationId      : medication.id,
                    DrugName          : medication.DrugName,
                    DrugId            : medication.DrugId,
                    Dose              : dose,
                    Details           : details,
                    TimeScheduleStart : start,
                    TimeScheduleEnd   : end,
                };

                var savedRecord = await this._medicationConsumptionRepo.create(domainModel);
                consumptions.push(savedRecord);
            }

            i = i + dayStep;
        }
        return consumptions;
    }
    
    markListAsTaken = async (consumptionIds: string[]): Promise<MedicationConsumptionDto[]> => {

        try {

            var takenMeds = [];
    
            for await (var id of consumptionIds) {
                
                var medConsumption = await this._medicationConsumptionRepo.getById(id);
                if (medConsumption === null) {
                    Logger.instance().log('Medication consumption instance with given id cannot be found.');
                    continue;
                }
    
                if (medConsumption.Status === MedicationConsumptionStatus.Missed) {
                    Logger.instance().log('Medication consumption instance with given id already marked as missed.');
                    continue;
                }
    
                if (medConsumption.Status === MedicationConsumptionStatus.Taken) {
                    Logger.instance().log('Medication consumption instance with given id already marked as taken.');
                    continue;
                }
    
                var takenAt = new Date();
                var isPastScheduleEnd = TimeHelper.isAfter(new Date(), medConsumption.TimeScheduleEnd);
                if (isPastScheduleEnd) {
                    takenAt = medConsumption.TimeScheduleEnd;
                }
   
                var updatedDto = await this._medicationConsumptionRepo.markAsTaken(id, takenAt);
                if (updatedDto === null) {
                    Logger.instance().log('Unable to mark medication as taken!');
                    continue;
                }
    
                //Now update the associated user task as completed
                //await this.completeAssociatedTask(medConsumption);
    
                takenMeds.push(updatedDto);
            }
            return takenMeds;
        }
        catch (error) {
            throw new ApiError(500, 'Unable to mark medications as taken!');
        }
    };

    markListAsMissed = async (consumptionIds: string[]): Promise<MedicationConsumptionDto[]> => {

        try {

            var missedMeds = [];
    
            for await (var id of consumptionIds) {
                
                var medConsumption = await this._medicationConsumptionRepo.getById(id);
                if (medConsumption === null) {
                    Logger.instance().log('Medication consumption instance with given id cannot be found.');
                    continue;
                }
    
                if (medConsumption.Status === MedicationConsumptionStatus.Missed) {
                    Logger.instance().log('Medication consumption instance with given id already marked as missed.');
                    continue;
                }
    
                if (medConsumption.Status === MedicationConsumptionStatus.Taken) {
                    Logger.instance().log('Medication consumption instance with given id already marked as taken.');
                    continue;
                }
    
                var updatedDto = await this._medicationConsumptionRepo.markAsMissed(id);
                if (updatedDto === null) {
                    Logger.instance().log('Unable to mark medication as missed!');
                    continue;
                }
    
                //Now update the associated user task as completed
                //await this.completeAssociatedTask(medConsumption);
    
                missedMeds.push(updatedDto);
            }
            return missedMeds;
        }
        catch (error) {
            throw new ApiError(500, 'Unable to mark medications as missed!');
        }
    };

    markAsTaken = async (id: string): Promise<MedicationConsumptionDetailsDto> => {

        var medConsumption = await this._medicationConsumptionRepo.getById(id);
        if (medConsumption === null) {
            Logger.instance().log('Medication consumption instance with given id cannot be found.');
            return null;
        }
   
        var takenAt = new Date();
        var isPastScheduleEnd = TimeHelper.isAfter(new Date(), medConsumption.TimeScheduleEnd);
        if (isPastScheduleEnd) {
            takenAt = medConsumption.TimeScheduleEnd;
        }
   
        var updatedDto = await this._medicationConsumptionRepo.markAsTaken(id, takenAt);
        if (updatedDto === null) {
            Logger.instance().log('Unable to mark medication as taken!');
            return null;
        }
    
        //Now update the associated user task as completed
        //await this.completeAssociatedTask(medConsumption);
    
        return updatedDto;
    };

    markAsMissed = async (id: string): Promise<MedicationConsumptionDto> => {

        var medConsumption = await this._medicationConsumptionRepo.getById(id);
        if (medConsumption === null) {
            Logger.instance().log('Medication consumption instance with given id cannot be found.');
            return null;
        }

        var updatedDto = await this._medicationConsumptionRepo.markAsMissed(id);
        if (updatedDto === null) {
            Logger.instance().log('Unable to mark medication as missed!');
            return null;
        }

        //Now update the associated user task as completed
        //await this.completeAssociatedTask(medConsumption);

        return updatedDto;
    };

    cancelFutureMedicationSchedules = async (medicationId: string): Promise<number> => {
        return await this._medicationConsumptionRepo.cancelFutureMedicationSchedules(medicationId);
    };

    deleteFutureMedicationSchedules = async (medicationId: string): Promise<number> => {
        return await this._medicationConsumptionRepo.deleteFutureMedicationSchedules(medicationId);
    };

    getById = async (id: string): Promise<MedicationConsumptionDetailsDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    search = async (filters: MedicationSearchFilters): Promise<MedicationSearchResults> => {
        return await this._medicationConsumptionRepo.search(filters);
    };

    getScheduleForDuration = async (patientUserId: string, duration: string, when: string)
        : Promise<MedicationConsumptionDto[]> => {
        var hours: number = this.parseDurationInHours(duration);
        return await this._medicationConsumptionRepo.getSchedulesForDuration(patientUserId, hours, when);
    };

    getSchedulesForDay = async (patientUserId: string, date: Date)
        : Promise<SchedulesForDayDto> => {
        var consumptions = await this._medicationConsumptionRepo.getSchedulesForDay(patientUserId, date);
        var schedules : SchedulesForDayDto = {
            Day       : date,
            Schedules : consumptions
        };
        return schedules;
    };

    getSchedulesForDayByDrugs = async (patientUserId: string, date: Date)
    : Promise<SummaryForDayDto> => {
    
        var consumptions = await this._medicationConsumptionRepo.getSchedulesForDay(patientUserId, date);
        var classifiedList = this.classifyByDrugs(consumptions);
        var summary: SummaryForDayDto = {
            Day           : date,
            SummaryForDay : classifiedList
        };
        return summary;
    };

    getSummaryByCalendarMonths = async (
        patientUserId: string,
        pastMonthsCount: number,
        futureMonthsCount: number): Promise<SummaryForMonthDto[]> => {
            
        if (futureMonthsCount > 2) {
            futureMonthsCount = 2;
        }
        if (pastMonthsCount > 6) {
            pastMonthsCount = 6;
        }
        
        //Get summary of last 6 months
        var summaryByMonth = [];

        for (var i = 0; i < 6; i++) {

            var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Months);
            var str = TimeHelper.format(date, 'YYYY-MM');

            var str = moment().subtract(i, "month")
                .startOf("month")
                .format('YYYY-MM');
                
            var monthName = moment().subtract(i, "month")
                .startOf("month")
                .format('MMMM, YYYY');
            var daysInMonth = moment(str, "YYYY-MM").daysInMonth();

            var medConsumptionsForMonth = await GetMedicationsForCalendarMonth(str, daysInMonth, patientUserId);
            var fn = (a, b) => { return new Date(a.TimeScheduleStart) - new Date(b.TimeScheduleStart); };
            medConsumptionsForMonth.sort(fn);

            // for (var d = 1; d <= daysInMonth; d++) {
            //     var dateStr = str + '-' + String(d).padStart(2, '0');
            //     var date = moment(dateStr).toDate();
            //     var meds = await this.GetMedicationScheduleForDay(patientUserId, date);
            //     medsForMonth.push(...meds);
            // }

            var listByDrugName = {};
            for (var k = 0; k < medConsumptionsForMonth.length; k++) {
                var drug = medConsumptionsForMonth[k].DrugName;
                if (!listByDrugName[drug]) {
                    listByDrugName[drug] = [];
                }
                listByDrugName[drug].push(medConsumptionsForMonth[k]);
            }
            var drugs = Object.keys(listByDrugName);
            var summaryByDrug = [];
            for (var drug of drugs) {
                var summary = GetSummary(listByDrugName[drug]);
                summaryByDrug.push({
                    Drug        : drug,
                    DrugSummary : summary,
                    Schedule    : listByDrugName[drug]
                }
                );
            }
            summaryByMonth.push({
                Month           : monthName,
                SummaryForMonth : summaryByDrug
            });

        }
        return summaryByMonth;
    };

    // private async completeAssociatedTask(medConsumption: MedicationConsumptionDetailsDto) {
    //     var task = await this._userTaskRepo.getTaskForUserWithReference(
    //      medConsumption.PatientUserId, medConsumption.id);
    //     var updatedTask = await this._userTaskRepo.completeTask(task.id);
    //     if (updatedTask === null) {
    //         Logger.instance().log("Unabled to update task assocaited with consumption!");
    //     }
    // }

    //#region Privates

    private parseDurationInHours = (duration: string): number => {
        var durationInHours = 0;
        var tokens = duration.toLowerCase().split(":");

        for (var i = 0; i < tokens.length; i++) {

            var x = tokens[i];

            if (x.includes("h")) {
                x = x.replace("h", "");
                var hours = parseInt(x);
                durationInHours += hours;
            }
            if (x.includes("d")) {
                x = x.replace("d", "");
                var days = parseInt(x);
                durationInHours += (days * 24);
            }
            if (x.includes("w")) {
                x = x.replace("w", "");
                var weeks = parseInt(x);
                durationInHours += (weeks * 24 * 7);
            }
            if (x.includes("m")) {
                x = x.replace("m", "");
                var months = parseInt(x);
                durationInHours += (months * 24 * 30);
            }
        }
        return durationInHours;

    }
    
    private getPatientTimeZone = async(patientUserId) => {
        var patient = await this._patientRepo.getByUserId(patientUserId);
        if (patient != null) {
            return patient.User.CurrentTimeZone;
        }
        return "+05:30";
    }

    private getMedicationDetails = (dose, dosageUnit, schedule) => {
        return dose.toFixed(1).toString() + ' ' + dosageUnit + ', ' + schedule;
    }

    private getScheduleSlots = (medication) => {

        // 'Morning',
        // 'Afternoon',
        // 'Evening',
        // 'Night',

        var scheduleSlots = [];

        var schedules = JSON.parse(medication.TimeSchedule) as string[];

        // If the frequency is defined weekly or monthly, by default return afternoon schedule
        if (medication.FrequencyUnit === MedicationFrequencyUnits.Weekly ||
            medication.FrequencyUnit === MedicationFrequencyUnits.Monthly) {
            scheduleSlots.push(
                {
                    schedule : MedicationTimeSchedules.Afternoon,
                    start    : (11 * 60) + 30,
                    end      : (60 * 13) + 30
                });
            return scheduleSlots;
        }

        for (var s of schedules) {
            if (s === MedicationTimeSchedules.Morning) {

                //7:30 am to 9:30 am
                scheduleSlots.push(
                    {
                        schedule : MedicationTimeSchedules.Morning,
                        start    : (7 * 60) + 30,
                        end      : (60 * 9) + 30
                    });
            }
            if (s === MedicationTimeSchedules.Afternoon) {

                //11:30 am to 1:30 pm
                scheduleSlots.push(
                    {
                        schedule : MedicationTimeSchedules.Afternoon,
                        start    : (11 * 60) + 30,
                        end      : (60 * 13) + 30
                    });
            }
            if (s === MedicationTimeSchedules.Evening) {

                //5:00 pm to 7:00 pm
                scheduleSlots.push(
                    {
                        schedule : MedicationTimeSchedules.Evening,
                        start    : (17 * 60),
                        end      : (60 * 19)
                    });
            }
            if (s === MedicationTimeSchedules.Night) {

                //8:30 pm to 10:30 pm
                scheduleSlots.push(
                    {
                        schedule : MedicationTimeSchedules.Night,
                        start    : (20 * 60) + 30,
                        end      : (60 * 22) + 30
                    });
            }
        }
        return scheduleSlots;
    }

    private getDurationInDays = (duration, durationUnit, refillsCount) => {

        var refills = 0;
        if (refillsCount) {
            refills = refillsCount;
        }
        if (durationUnit === MedicationDurationUnits.Days) {
            return duration * 1 * (refills + 1);
        }
        if (durationUnit === MedicationDurationUnits.Weeks) {
            return duration * 7 * (refills + 1);
        }
        if (durationUnit === MedicationDurationUnits.Months) {
            return duration * 30 * (refills + 1);
        }
        return 1;
    }

    private getDayStep = (frequency, frequencyUnit) => {

        if (frequencyUnit === MedicationFrequencyUnits.Daily) {
            return 1;
        }
        if (frequencyUnit === MedicationFrequencyUnits.Weekly) {
            return Math.round(7 / frequency);
        }
        if (frequencyUnit === MedicationFrequencyUnits.Monthly) {
            return Math.round(30 / frequency);
        }
        return 1;
    }

    private getSummary = (medConsumptions: MedicationConsumptionDetailsDto[]) => {

        var summary = {
            Missed   : 0,
            Taken    : 0,
            Unknown  : 0,
            Upcoming : 0,
            Overdue  : 0
        };

        for (var i = 0; i < medConsumptions.length; i++) {
            var consumption = medConsumptions[i];
            if (consumption.Status === MedicationConsumptionStatus.Missed) {
                summary['Missed']++;
            }
            if (consumption.Status === MedicationConsumptionStatus.Taken) {
                summary['Taken']++;
            }
            if (consumption.Status === MedicationConsumptionStatus.Unknown) {
                summary['Unknown']++;
            }
            if (consumption.Status === MedicationConsumptionStatus.Overdue) {
                summary['Overdue']++;
            }
            if (consumption.Status === MedicationConsumptionStatus.Upcoming) {
                summary['Upcoming']++;
            }
        }

        return summary;
    }

    private classifyByDrugs = (medConsumptions: MedicationConsumptionDto[])
        : SummarizedScheduleDto[] => {

        var arrangedByDrugList: SummarizedScheduleDto[] = [];
        
        var listByDrugName = this.segregateByDrugName(medConsumptions);
        for (const key in listByDrugName) {
            var drug = key;
            var consumptions = listByDrugName[key];
            var summary = this.getSummary(consumptions);
            var summarizedSchedule : SummarizedScheduleDto = {
                Drug           : drug,
                SummaryForDrug : summary,
                Schedule       : consumptions
            };
            arrangedByDrugList.push(summarizedSchedule);
        }

        return arrangedByDrugList;
    }

    private segregateByDrugName = (medConsumptions: MedicationConsumptionDetailsDto[]) => {

        var listByDrugName = {};
        
        for (var i = 0; i < medConsumptions.length; i++) {
            var drug = medConsumptions[i].DrugName;
            if (!listByDrugName[drug]) {
                listByDrugName[drug] = [];
            }
            listByDrugName[drug].push(medConsumptions[i]);
        }
        
        return listByDrugName;
    }

    //#endregion
    
}
