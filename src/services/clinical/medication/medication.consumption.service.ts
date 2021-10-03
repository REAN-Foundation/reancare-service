import { inject, injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { Logger } from "../../../common/logger";
import { TimeHelper } from "../../../common/time.helper";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/patient/patient.repo.interface";
import { ConsumptionSummaryDto, ConsumptionSummaryForMonthDto, MedicationConsumptionDetailsDto, MedicationConsumptionDto } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionStatus } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types";
import { MedicationSearchFilters, MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionService {

    constructor(
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,

        //@inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
    ) {}

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

    // updateTimeZoneForFutureMedicationSchedules = async (
    //     medicationId: string,
    //     currentTimeZone: string,
    //     newTimeZone: string): Promise<string[]> => {
    //     var updatedConsumptionIds = await this._medicationConsumptionRepo.updateTimeZoneForFutureMedicationSchedules(
    //         medicationId, currentTimeZone, newTimeZone);
    //     return updatedConsumptionIds;
    // };

    getById = async (id: string): Promise<MedicationConsumptionDetailsDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    search = async (filters: MedicationSearchFilters): Promise<MedicationSearchResults> => {
        return await this._medicationConsumptionRepo.search(filters);
    };

    getScheduleForDuration = async (patientUserId: string, duration: string, when: string)
        : Promise<MedicationConsumptionDto[]> => {
        
        var hours: number = this.parseDurationInHours(duration);

        return await this._medicationConsumptionRepo.getScheduleForDuration(patientUserId, duration, when);
    };

    getScheduleForDay = async (patientUserId: string, date: Date, groupByDrug: boolean)
        : Promise<MedicationConsumptionDto[]> => {
        return await this._medicationConsumptionRepo.getScheduleForDay(patientUserId, date, groupByDrug);
    };

    getSummaryForDay = async (patientUserId: string, date: Date): Promise<ConsumptionSummaryDto> => {
        return await this._medicationConsumptionRepo.getSummaryForDay(patientUserId, date);
    };

    getSummaryByCalendarMonths = async (
        patientUserId: string,
        pastMonthsCount: number,
        futureMonthsCount: number): Promise<ConsumptionSummaryForMonthDto[]> => {
            
        if (futureMonthsCount > 2) {
            futureMonthsCount = 2;
        }
        if (pastMonthsCount > 6) {
            pastMonthsCount = 6;
        }
        return await this._medicationConsumptionRepo.getSummaryByCalendarMonths(
            patientUserId, pastMonthsCount, futureMonthsCount);
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
        if (medication.FrequencyUnit.toLowerCase() == 'weekly' || medication.FrequencyUnit.toLowerCase() == 'monthly') {
            scheduleSlots.push({ schedule: 'afternoon', start: (11 * 60) + 30, end: (60 * 13) + 30 });
            return scheduleSlots;
        }

        for (var s of schedules) {
            if (s == 'Morning') {

                //7:30 am to 9:30 am
                scheduleSlots.push({ schedule: 'morning', start: (7 * 60) + 30, end: (60 * 9) + 30 });
            }
            if (s == 'Afternoon') {

                //11:30 am to 1:30 pm
                scheduleSlots.push({ schedule: 'afternoon', start: (11 * 60) + 30, end: (60 * 13) + 30 });
            }
            if (s == 'Evening') {

                //5:00 pm to 7:00 pm
                scheduleSlots.push({ schedule: 'evening', start: (17 * 60), end: (60 * 19) });
            }
            if (s == 'Night') {

                //8:30 pm to 10:30 pm
                scheduleSlots.push({ schedule: 'night', start: (20 * 60) + 30, end: (60 * 22) + 30 });
            }
        }
        return scheduleSlots;
    }

    private getDurationInDays = (duration, durationUnit, refillsCount) => {

        var refills = 0;
        if (refillsCount) {
            refills = refillsCount;
        }
        if (durationUnit.toLowerCase() === 'days') {
            return duration * 1 * (refills + 1);
        }
        if (durationUnit.toLowerCase() === 'weeks') {
            return duration * 7 * (refills + 1);
        }
        if (durationUnit.toLowerCase() === 'months') {
            return duration * 30 * (refills + 1);
        }
        return 1;
    }

    private getDayStep = (frequency, frequencyUnit) => {

        if (frequencyUnit.toLowerCase() === 'daily') {
            return 1;
        }
        if (frequencyUnit.toLowerCase() === 'weekly') {
            return Math.round(7 / frequency);
        }
        if (frequencyUnit.toLowerCase() === 'monthly') {
            return Math.round(30 / frequency);
        }
        return 1;
    }

    private getSummary = (medConsumptions) => {

        var summary = {
            Missed   : 0,
            Taken    : 0,
            Unknown  : 0,
            Upcoming : 0,
            Overdue  : 0
        };

        for (var i = 0; i < medConsumptions.length; i++) {
            var med = medConsumptions[i];
            if (med.Status === 'missed') {
                summary['Missed']++;
            }
            if (med.Status === 'taken') {
                summary['Taken']++;
            }
            if (med.Status === 'unknown') {
                summary['Unknown']++;
            }
            if (med.Status === 'overdue') {
                summary['Overdue']++;
            }
            if (med.Status === 'upcoming') {
                summary['Upcoming']++;
            }
        }

        return summary;
    }

    //#endregion
    
}
