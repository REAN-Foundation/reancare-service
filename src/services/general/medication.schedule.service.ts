import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';
import { MedicationDto } from '../../domain.types/clinical/medication/medication/medication.dto';
import { Injector } from '../../startup/injector';
import { MEDICATION_CONSUMPTION_DURATION_DAYS, MedicationConsumptionService } from '../clinical/medication/medication.consumption.service';
import { CronExpressionParser } from 'cron-parser';

/////////////////////////////////////////////////////////////////////

export class MedicationScheduleHandler {

    private static _numAsyncTasks = 4;

    private static _medicationConsumptionQueue = asyncLib.queue((
        task: {Medication: MedicationDto, CronExpression: string},
        onCompleted
    ) => {
        (async () => {
            await MedicationScheduleHandler.createMedicationConsumption(task.Medication, task.CronExpression);
            onCompleted();
        })();
    }, MedicationScheduleHandler._numAsyncTasks);

    private static createMedicationConsumption = async (medication: MedicationDto, cronExpression: string) => {
        try {
            Logger.instance().log(`Creating medication consumption task...`);
            const medicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

            let medicationConsumptionCount = await medicationConsumptionService.
                getScheduledMedicationCountById(medication.id);

            medicationConsumptionCount = medicationConsumptionCount / medication.Frequency;

            const dayStep = medicationConsumptionService.getDayStep(
                medication.Frequency,
                medication.FrequencyUnit
            );
            const totalScheduledDays = medicationConsumptionCount * dayStep;
    
            const days = medicationConsumptionService.getDurationInDays(
                medication.Duration,
                medication.DurationUnit,
                medication.RefillCount
            );
            const customScheduleDate = TimeHelper.addDuration(
                medication.StartDate,
                totalScheduledDays,
                DurationType.Day
            );
                
            let medicationConsumptionDurationDays = MEDICATION_CONSUMPTION_DURATION_DAYS;
    
            const nextScheduledDate = MedicationScheduleHandler.findNextScheduledDate(cronExpression);
            Logger.instance().log(`Next scheduled date: ${nextScheduledDate}`);

            if (customScheduleDate < nextScheduledDate) {
                const difference = Math.ceil(TimeHelper.dayDiff(nextScheduledDate, customScheduleDate));
                if (difference > 0 && difference <= medicationConsumptionDurationDays) {
                    medicationConsumptionDurationDays = difference;
                }
            }
            
            Logger.instance().log(`######################################`);
            Logger.instance().log(`Medication: ${JSON.stringify(medication)}`);
            Logger.instance().log(`Custom Schedule Date: ${customScheduleDate}`);
            Logger.instance().log(`Total Scheduled Days: ${totalScheduledDays}`);
            Logger.instance().log(`Medication Consumption Duration Days: ${medicationConsumptionDurationDays}`);
            Logger.instance().log(`######################################`);
                
            if (totalScheduledDays < days &&
                customScheduleDate < medication.EndDate &&
                customScheduleDate < nextScheduledDate)
            {
                await medicationConsumptionService.create(
                    medication,
                    customScheduleDate,
                    totalScheduledDays,
                    medicationConsumptionDurationDays
                );
            }
        } catch (error) {
            Logger.instance().log(`Error creating medication consumption task ${error}`);
        }
    };
    
    private static findNextScheduledDate = (cronExpression: string): Date => {
        try {
            const interval = CronExpressionParser.parse(cronExpression);
            let nextRun: Date = interval.next().toDate();
            if (nextRun.getTime() <= new Date().getTime()) {
                nextRun = interval.next().toDate();
            }
            return nextRun;
        } catch (error) {
            Logger.instance().log(`Error parsing cron expression: ${cronExpression}`);
            return null;
        }
    };

   public static scheduleMedicationConsumption = async (medication: MedicationDto, cronExpression: string) => {
       MedicationScheduleHandler._medicationConsumptionQueue.push({
           Medication : medication, CronExpressionParser : cronExpression
       }, (err) => {
           if (err) {
               Logger.instance().log('Error pushing MedicationConsumption event:' + err.message);
           }
       });
   };

}
////////////////////////////////////////////////////////////////////////////////////////////////////////
