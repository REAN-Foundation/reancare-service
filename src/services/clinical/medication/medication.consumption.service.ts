import { inject, injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { Helper } from "../../../common/helper";
import { Logger } from "../../../common/logger";
import { TimeHelper } from "../../../common/time.helper";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IUserDeviceDetailsRepo } from "../../../database/repository.interfaces/users/user/user.device.details.repo.interface ";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { MedicationConsumptionDomainModel } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto, MedicationConsumptionStatsDto, SchedulesForDayDto, SummarizedScheduleDto, SummaryForDayDto, SummaryForMonthDto } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionStatus } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types";
import { MedicationDto } from "../../../domain.types/clinical/medication/medication/medication.dto";
import { MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';
import { MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from "../../../domain.types/clinical/medication/medication/medication.types";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";
import { UserActionType, UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { UserTaskDomainModel } from "../../../domain.types/users/user.task/user.task.domain.model";
import { IUserActionService } from "../../users/user/user.action.service.interface";
import { Loader } from "../../../startup/loader";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { MedicationConsumptionStore } from "../../../modules/ehr/services/medication.consumption.store";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import * as MessageTemplates from '../../../modules/communication/message.template/message.templates.json';
import { MedicationConsumptionSearchFilters } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionService implements IUserActionService {

    _ehrMedicationConsumptionStore: MedicationConsumptionStore = null;

    constructor(
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrMedicationConsumptionStore = Loader.container.resolve(MedicationConsumptionStore);
        }
    }

    create = async (medication: MedicationDto, customStartDate = null)
        :Promise<MedicationConsumptionStatsDto> => {

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
        var dose = medication.Dose.toString();
        var dosageUnit = medication.DosageUnit;
        var refills = medication.RefillCount;

        var days = this.getDurationInDays(duration, durationUnit, refills);
        var dayStep = this.getDayStep(frequency, frequencyUnit);

        var totalCount = 0;
        var pendingCount = 0;
        //var now = new Date();

        var consumptions: MedicationConsumptionDto[] = [];

        //Logger.instance().log(startDate.toISOString());

        var i = 0;

        while (i < days) {

            var day = TimeHelper.addDuration(startDate, i, DurationType.Day);

            for (var j = 0; j < scheduleTimings.length; j++) {

                var details = this.getMedicationDetails(
                    medication.DrugName, dose, dosageUnit, scheduleTimings[j].schedule);
                var start_minutes = scheduleTimings[j].start;
                var end_minutes = scheduleTimings[j].end;
                var start = TimeHelper.addDuration(day, start_minutes, DurationType.Minute);
                var end = TimeHelper.addDuration(day, end_minutes, DurationType.Minute);

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
                await this.createMedicationTaskForSchedule(savedRecord);

                totalCount++;

                // if (TimeHelper.isAfter(now, start)) {
                //     pendingCount++;
                //     //Add task only for the schedule which is in next two days
                //     var afterTwoDays = TimeHelper.addDuration(now, 2, DurationType.Day);
                //     if (start < afterTwoDays) {
                //         await this.createMedicationTaskForSchedule(savedRecord);
                //     }
                // }

                consumptions.push(savedRecord);
            }

            i = i + dayStep;
        }

        var creationSummary: MedicationConsumptionStatsDto = {
            TotalConsumptionCount   : totalCount,
            PendingConsumptionCount : pendingCount
        };

        return creationSummary;
    };

    getConsumptionStatusForMedication = async (medicationId: string)
        : Promise<MedicationConsumptionStatsDto> => {

        var totalCount = await this._medicationConsumptionRepo.getTotalConsumptionCountForMedication(medicationId);
        var pendingCount = await this._medicationConsumptionRepo.getPendingConsumptionCountForMedication(medicationId);

        var creationSummary: MedicationConsumptionStatsDto = {
            TotalConsumptionCount   : totalCount,
            PendingConsumptionCount : pendingCount
        };

        return creationSummary;
    };

    markListAsTaken = async (consumptionIds: string[]): Promise<MedicationConsumptionDto[]> => {

        try {

            var takenMeds = [];

            for await (var id of consumptionIds) {

                var medConsumption = await this._medicationConsumptionRepo.getById(id);
                if (medConsumption === null) {
                    Logger.instance().log('Medication consumption instance with given id cannot be found.');
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
                await this.finishAssociatedTask(medConsumption);

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

                var updated = await this._medicationConsumptionRepo.markAsMissed(id);
                if (updated === null) {
                    Logger.instance().log('Unable to mark medication as missed!');
                    continue;
                }

                //Now update the associated user task as completed
                await this.finishAssociatedTask(medConsumption);

                missedMeds.push(updated);
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

        if (this._ehrMedicationConsumptionStore) {
            const ehrId = await this._ehrMedicationConsumptionStore.add(medConsumption);
            medConsumption.EhrId = ehrId;
            await this._medicationConsumptionRepo.assignEhrId(id, medConsumption.EhrId);
        }

        var takenAt = new Date();
        var isPastScheduleEnd = TimeHelper.isAfter(new Date(), medConsumption.TimeScheduleEnd);
        if (isPastScheduleEnd) {
            takenAt = medConsumption.TimeScheduleEnd;
        }

        var updated = await this._medicationConsumptionRepo.markAsTaken(id, takenAt);
        if (updated === null) {
            Logger.instance().log('Unable to mark medication as taken!');
            return null;
        }

        //Now update the associated user task as completed
        await this.finishAssociatedTask(updated);

        return updated;
    };

    markAsMissed = async (id: string): Promise<MedicationConsumptionDetailsDto> => {

        var updatedDto = await this._medicationConsumptionRepo.markAsMissed(id);
        if (updatedDto === null) {
            Logger.instance().log('Unable to mark medication as missed!');
            return null;
        }

        // var medConsumption = await this._medicationConsumptionRepo.getById(id);
        // if (medConsumption === null) {
        //     Logger.instance().log('Medication consumption instance with given id cannot be found.');
        //     return null;
        // }

        //Now update the associated user task as completed
        await this.finishAssociatedTask(updatedDto);

        return updatedDto;
    };

    deleteFutureMedicationSchedules = async (medicationId: string): Promise<number> => {
        return await this._medicationConsumptionRepo.deleteFutureMedicationSchedules(medicationId);
    };

    getById = async (id: string): Promise<MedicationConsumptionDetailsDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    getByMedicationId = async (id: string): Promise<MedicationConsumptionDetailsDto[]> => {
        return await this._medicationConsumptionRepo.getByMedicationId(id);
    };

    search = async (filters: MedicationConsumptionSearchFilters): Promise<MedicationSearchResults> => {
        return await this._medicationConsumptionRepo.search(filters);
    };

    getAllTakenBefore = async (patientUserId: uuid, date: Date): Promise<any[]> => {
        return await this._medicationConsumptionRepo.getAllTakenBefore(patientUserId, date);
    };

    getAllTakenBetween = async (patientUserId: uuid, dateFrom: Date, dateTo: Date) : Promise<any[]> => {
        return await this._medicationConsumptionRepo.getAllTakenBetween(patientUserId, dateFrom, dateTo);
    };

    getScheduleForDuration = async (patientUserId: string, duration: string, when: string)
        : Promise<MedicationConsumptionDto[]> => {

        var durationInHours: number = this.parseDurationInHours(duration);

        try {

            var dtos: MedicationConsumptionDto[] = [];

            if (when === 'past') {
                var from = TimeHelper.subtractDuration(new Date(), durationInHours, DurationType.Hour);
                dtos = await this._medicationConsumptionRepo.getSchedulesForPatientForDuration(
                    patientUserId, from, new Date());
            }
            if (when === 'future') {
                var to = TimeHelper.addDuration(new Date(), durationInHours, DurationType.Hour);
                dtos = await this._medicationConsumptionRepo.getSchedulesForPatientForDuration(
                    patientUserId, new Date(), to);
            }
            if (when === 'current') {
                var currentDurationSlotHrs = 2;
                var from = TimeHelper.subtractDuration(new Date(), currentDurationSlotHrs, DurationType.Hour);
                var to = TimeHelper.addDuration(new Date(), currentDurationSlotHrs, DurationType.Hour);
                dtos = await this._medicationConsumptionRepo.getSchedulesForPatientForDuration(patientUserId, from, to);
            }

            var fn = (a: MedicationConsumptionDto, b: MedicationConsumptionDto): any => {
                return a.TimeScheduleStart.getTime() - b.TimeScheduleStart.getTime();
            };
            if (when === 'past') {
                fn = (a, b) => {
                    return b.TimeScheduleStart.getTime() - a.TimeScheduleStart.getTime();
                };
            }
            dtos.sort(fn);
            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

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
        var consumptionSummaryForMonths = [];

        for (var i = 0; i < 6; i++) {

            var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
            var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
            var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
            var monthName = TimeHelper.format(date, 'MMMM, YYYY');
            var daysInMonth = TimeHelper.daysInMonthContainingDate(date);

            // var str = TimeHelper.format(date, 'YYYY-MM');

            var medConsumptionsForMonth = await this._medicationConsumptionRepo.getSchedulesForPatientForDuration(
                patientUserId, startOfMonth, endOfMonth);
            var fn = (a, b) => {
                return a.TimeScheduleStart.getTime() - b.TimeScheduleStart.getTime();
            };
            medConsumptionsForMonth.sort(fn);

            var classified = this.classifyByDrugs(medConsumptionsForMonth);
            var summaryForMonth: SummaryForMonthDto = {
                Month           : monthName,
                DaysInMonth     : daysInMonth,
                SummaryForMonth : classified
            };
            consumptionSummaryForMonths.push(summaryForMonth);
        }
        return consumptionSummaryForMonths;
    };

    sendMedicationReminders = async (pastMinutes: number): Promise<number> => {
        var count = 0;
        var from = TimeHelper.subtractDuration(new Date(), pastMinutes, DurationType.Minute);
        var to = TimeHelper.subtractDuration(new Date(), 1, DurationType.Minute);
        var schedules = await this._medicationConsumptionRepo.getSchedulesForDuration(from, to, true);

        var schedulesForPatient = {};
        schedules.forEach(schedule => {
            if (!schedulesForPatient[schedule.PatientUserId]) {
                schedulesForPatient[schedule.PatientUserId] = [];
            }
            schedulesForPatient[schedule.PatientUserId].push(schedule);
        });

        for await (var a of Object.keys(schedulesForPatient)) {
            await this.sendMedicationReminder(schedulesForPatient[a]);
            count++;
        }
        return count;
    };

    createMedicationTasks = async (upcomingInMinutes: number): Promise<number> => {
        var count = 0;
        var from = new Date();
        var to = TimeHelper.addDuration(from, upcomingInMinutes, DurationType.Minute);
        var schedules = await this._medicationConsumptionRepo.getSchedulesForDuration(from, to, false);
        for await (var a of schedules) {
            if (true === await this.createMedicationTaskForSchedule(a))
            {
                count++;
            }
        }
        return count;
    };

    createMedicationTaskForSchedule = async (consumption: MedicationConsumptionDto): Promise<boolean> => {

        const existingTask = await this._userTaskRepo.getTaskForUserWithAction(
            consumption.PatientUserId, consumption.id);

        if (existingTask !== null) {
            return false; //If exists...
        }

        const displayId = Helper.generateDisplayId('TSK');
        const domainModel: UserTaskDomainModel = {
            Task               : consumption.Details,
            DisplayId          : displayId,
            UserId             : consumption.PatientUserId,
            Category           : UserTaskCategory.Medication,
            ActionId           : consumption.id,
            ActionType         : UserActionType.Medication,
            ScheduledStartTime : consumption.TimeScheduleStart,
            ScheduledEndTime   : consumption.TimeScheduleEnd,
            IsRecurrent        : false,
        };
        await this._userTaskRepo.create(domainModel);

        return true;
    };

    startAction = async (actionId: uuid): Promise<boolean> => {
        var medConsumption = await this._medicationConsumptionRepo.getById(actionId);
        if (medConsumption === null) {
            Logger.instance().log('Medication consumption instance with given id cannot be found.');
            return false;
        }
        return true;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    completeAction = async (actionId: uuid, completionTime?: Date, success?: boolean)
        : Promise<boolean> => {

        if (success === undefined || success === false) {
            var updatedDto = await this._medicationConsumptionRepo.markAsMissed(actionId);
            if (updatedDto === null) {
                Logger.instance().log('Unable to mark medication as missed!');
                return false;
            }
        }
        else {
            var medConsumption = await this._medicationConsumptionRepo.getById(actionId);
            if (medConsumption === null) {
                Logger.instance().log('Medication consumption instance with given id cannot be found.');
                return false;
            }
            var takenAt = completionTime ?? new Date();
            var isPastScheduleEnd = TimeHelper.isAfter(takenAt, medConsumption.TimeScheduleEnd);
            if (isPastScheduleEnd) {
                takenAt = medConsumption.TimeScheduleEnd;
            }
            var updated = await this._medicationConsumptionRepo.markAsTaken(actionId, takenAt);
            if (updated === null) {
                Logger.instance().log('Unable to mark medication as taken!');
                return null;
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cancelAction = async(actionId: string): Promise<boolean> => {
        return await this._medicationConsumptionRepo.cancelSchedule(actionId);
    };

    getAction = async(actionId: string): Promise<any> => {
        return await this.getById(actionId);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAction = async(actionId: string): Promise<any> => {
        return await this.getById(actionId);
    };

    //#region Privates

    private async finishAssociatedTask(medConsumption: MedicationConsumptionDetailsDto) {

        var task = await this._userTaskRepo.getTaskForUserWithAction(
            medConsumption.PatientUserId, medConsumption.id);
        if (task === null) {
            return;
        }
        var updatedTask = await this._userTaskRepo.finishTask(task.id);
        if (updatedTask === null) {
            Logger.instance().log("Unabled to update task assocaited with consumption!");
        }
    }

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

    };

    private getPatientTimeZone = async(patientUserId) => {
        var user = await this._userRepo.getById(patientUserId);
        if (user != null) {
            return user.CurrentTimeZone;
        }
        return "+05:30";
    };

    private getMedicationDetails = (drugName, dose, dosageUnit, schedule) => {
        return drugName + ': ' + dose.toString() + ' ' + dosageUnit + ', ' + schedule;
    };

    private getScheduleSlots = (medication) => {

        // 'Morning',
        // 'Afternoon',
        // 'Evening',
        // 'Night',

        var scheduleSlots = [];

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

        for (var s of medication.TimeSchedules) {
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
    };

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
    };

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
        if (frequencyUnit === MedicationFrequencyUnits.Other) {
            return 0;
        }
        return 1;
    };

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
    };

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
                Schedules      : consumptions
            };
            arrangedByDrugList.push(summarizedSchedule);
        }

        return arrangedByDrugList;
    };

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
    };

    sendMedicationReminder = async (medicationSchedules) => {

        var patientUserId = medicationSchedules[0].PatientUserId;
        var user = await this._userRepo.getById(patientUserId);
        var person = await this._personRepo.getById(user.PersonId);

        var deviceList = await this._userDeviceDetailsRepo.getByUserId(patientUserId);
        var deviceListsStr = JSON.stringify(deviceList, null, 2);
        Logger.instance().log(`Sent medication reminders to following devices - ${deviceListsStr}`);

        var medicationDrugNames = [];
        medicationSchedules.forEach(medicationSchedule => {
            medicationDrugNames.push(medicationSchedule.DrugName);
        });

        var duration = TimeHelper.getTimezoneOffsets(user.DefaultTimeZone, DurationType.Minute);
        var updatedTime = TimeHelper.subtractDuration(
            medicationSchedules[0].TimeScheduleEnd, duration, DurationType.Minute);

        var title = MessageTemplates.MedicationReminder.Title;
        title = title.replace("{{PatientName}}", person.FirstName ?? "there");
        title = title.replace("{{DrugName}}", medicationDrugNames.join(', '));
        var body = MessageTemplates.MedicationReminder.Body;
        body = body.replace("{{EndTime}}", TimeHelper.format(updatedTime, 'hh:mm A'));

        Logger.instance().log(`Notification Title: ${title}`);
        Logger.instance().log(`Notification Body: ${body}`);

        var message = Loader.notificationService.formatNotificationMessage(
            MessageTemplates.MedicationReminder.NotificationType, title, body
        );
        for await (var device of deviceList) {
            await Loader.notificationService.sendNotificationToDevice(device.Token, message);
        }

    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, model: MedicationConsumptionDetailsDto, appName?: string) => {
        
        if (model.IsTaken == false &&  model.IsMissed == false) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                patientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date (model.CreatedAt) : null
            );
        }

        if (model.IsTaken) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                patientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date (model.CreatedAt) : null
            );
        }

        if (model.IsMissed) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                patientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    //#endregion

}
