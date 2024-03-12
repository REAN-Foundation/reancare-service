import * as cron from 'node-cron';
import * as CronSchedules from '../../seed.data/cron.schedules.json';
import { Logger } from '../common/logger';
import { MedicationConsumptionService } from '../services/clinical/medication/medication.consumption.service';
import { FileResourceService } from '../services/general/file.resource.service';
import { Loader } from './loader';
import { CareplanService } from '../services/clinical/careplan.service';
import { CustomActionsHandler } from '../custom/custom.actions.handler';
import { CommunityNetworkService } from '../modules/community.bw/community.network.service';
import { ReminderSenderService } from '../services/general/reminder.sender.service';
import { TerraSupportService } from '../api/devices/device.integrations/terra/terra.support.controller';
import { UserService } from '../services/users/user/user.service';
import { UserTaskSenderService } from '../services/users/user/user.task.sender.service';
import { EHRAssessmentService } from '../modules/ehr.analytics/ehr.assessment.service';
import { EHRCareplanActivityService } from '../modules/ehr.analytics/ehr.careplan.activity.service';
import { EHRVitalService } from '../modules/ehr.analytics/ehr.vital.service';
import { EHRLabService } from '../modules/ehr.analytics/ehr.lab.service';
import { EHRMentalWellBeingService } from '../modules/ehr.analytics/ehr.mental.wellbeing.service';
import { EHRPhysicalActivityService } from '../modules/ehr.analytics/ehr.physical.activity.service';
import { EHRNutritionService } from '../modules/ehr.analytics/ehr.nutrition.service';
import { EHRSymptomService } from '../modules/ehr.analytics/ehr.symptom.service';
import { EHRMedicationService } from '../modules/ehr.analytics/ehr.medication.service';
import { EHRAnalyticsHandler } from '../modules/ehr.analytics/ehr.analytics.handler';
import { StatisticsService } from '../services/statistics/statistics.service';

///////////////////////////////////////////////////////////////////////////

export class Scheduler {

    //#region Static privates

    private static _instance: Scheduler = null;

    private static _schedules = null;

    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        Scheduler._schedules = CronSchedules[env];
        Logger.instance().log('Initializing the schedular.');
    }

    //#endregion

    //#region Publics

    public static instance(): Scheduler {
        return this._instance || (this._instance = new this());
    }

    public schedule = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                this.scheduleFileCleanup();
                this.scheduleMedicationReminders();
                this.scheduleCreateMedicationTasks();
                this.scheduleMonthlyCustomTasks();
                this.scheduleDailyCareplanPushTasks();
                this.scheduleDailyHighRiskCareplan();
                this.scheduleHsSurvey();
                this.scheduleReminderOnNoActionToDonationRequest();
                this.scheduleReminders();
                this.scheduleCareplanRegistrationReminders();
                this.scheduleFetchDataFromDevices();
                this.scheduleCurrentTimezoneUpdate();

                //this.scheduleDaillyPatientTasks();
                this.scheduleCareplanRegistrationRemindersForOldUsers();
                this.scheduleExistingVitalDataToEHR();
                this.scheduleExistingLabDataToEHR();
                this.scheduleExistingPhysicalActivityDataToEHR();
                this.scheduleExistingMentalWellBeingDataToEHR();
                this.scheduleExistingNutritionDataToEHR();
                this.scheduleExistingMedicationDataToEHR();
                this.scheduleExistingSymptomDataToEHR();
                this.scheduleExistingCareplanActivityDataToEHR();
                this.scheduleExistingAssessmentDataToEHR();
                this.scheduleExistingStaticDataToEHR();
                this.scheduleDailyStatistics();
                this.scheduleStrokeSurvey();


                resolve(true);
            } catch (error) {
                Logger.instance().log('Error initializing the scheduler.: ' + error.message);
                reject(false);
            }
        });
    };

    //#endregion

    //#region Privates

    private scheduleDailyStatistics = ()=>{
        cron.schedule(Scheduler._schedules['DailyStatistics'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: creating overall statistics...');
                var service = Loader.container.resolve(StatisticsService);
                await service.createDailyStatistics();
            })();
        });
    };

    private scheduleFileCleanup = () => {
        cron.schedule(Scheduler._schedules['FileCleanup'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: temp file clean-up...');
                var service = Loader.container.resolve(FileResourceService);
                await service.cleanupTempFiles();
            })();
        });
    };

    private scheduleReminders = () => {
        cron.schedule(Scheduler._schedules['Reminders'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: Reminders...');
                const nextMinutes = 15;
                await ReminderSenderService.sendReminders(nextMinutes);
            })();
        });
    };

    private scheduleMedicationReminders = () => {
        cron.schedule(Scheduler._schedules['MedicationReminder'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: Reminders for medications...');
                var service = Loader.container.resolve(MedicationConsumptionService);
                var pastMinutes = 15;
                var count = await service.sendMedicationReminders(pastMinutes);
                Logger.instance().log(`Total ${count} medication reminders sent.`);
            })();
        });
    };

    private scheduleCreateMedicationTasks = () => {
        cron.schedule(Scheduler._schedules['CreateMedicationTasks'], () => {
            // (async () => {
            //     Logger.instance().log('Running scheducled jobs: Create medication tasks...');
            //     var service = Loader.container.resolve(MedicationConsumptionService);
            //     var upcomingInMinutes = 60 * 24 * 2;
            //     var count = await service.createMedicationTasks(upcomingInMinutes);
            //     Logger.instance().log(`Total ${count} new medication tasks created.`);
            // })();
        });
    };

    private scheduleMonthlyCustomTasks = () => {
        cron.schedule(Scheduler._schedules['ScheduleCustomTasks'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Custom Tasks...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduledMonthlyRecurrentTasks();
            })();
        });
    };

    private scheduleCareplanRegistrationReminders = () => {
        cron.schedule(Scheduler._schedules['CareplanRegistrationReminder'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Reminders for Careplan Registration...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduleCareplanRegistrationReminders();
            })();
        });
    };

    private scheduleCareplanRegistrationRemindersForOldUsers = () => {
        cron.schedule(Scheduler._schedules['CareplanRegistrationReminderForOldUsers'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Reminders to be sent to old users for Careplan Registration...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduleCareplanRegistrationRemindersForOldUsers();
            })();
        });
    };

    private scheduleDailyCareplanPushTasks = () => {
        cron.schedule(Scheduler._schedules['ScheduleDailyCareplanPushTasks'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Maternity Careplan Task...');
                const careplanService = Loader.container.resolve(CareplanService);
                await careplanService.scheduleDailyCareplanPushTasks();
                const nextMinutes = 15;
                const userTaskService = Loader.container.resolve(UserTaskSenderService);
                await userTaskService.sendUserTasks(nextMinutes);
            })();
        });
    };

    private scheduleDailyHighRiskCareplan = () => {
        cron.schedule(Scheduler._schedules['ScheduleDailyHighRiskCareplan'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Daily High Risk Careplan...');
                const careplanService = Loader.container.resolve(CareplanService);
                await careplanService.scheduleDailyHighRiskCareplan();
            })();
        });
    };

    private scheduleHsSurvey = () => {
        cron.schedule(Scheduler._schedules['ScheduleHsSurvey'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Custom HS Survey Tasks...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduleHsSurvey();
            })();
        });
    };

    private scheduleStrokeSurvey = () => {
        cron.schedule(Scheduler._schedules['ScheduleStrokeSurvey'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Stroke Survey notification...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduleStrokeSurvey();
            })();
        });
    };

    private scheduleReminderOnNoActionToDonationRequest = () => {
        cron.schedule(Scheduler._schedules['ReminderOnNoActionToDonationRequest'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Reminder On No Action To Donation Requests...');
                var communityNetworkService = Loader.container.resolve(CommunityNetworkService);
                await communityNetworkService.reminderOnNoActionToDonationRequest();
                await communityNetworkService.reminderOnNoActionToFifthDayReminder();
            })();
        });
    };

    private scheduleFetchDataFromDevices = () => {
        cron.schedule(Scheduler._schedules['ScheduleFetchDataFromDevices'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Fetch data from wearable devices...');
                var terraSupportService = new TerraSupportService();
                await terraSupportService.getAllHealthAppUser();
                await terraSupportService.fetchDataForAllUser();
            })();
        });
    };

    private scheduleCurrentTimezoneUpdate = () => {
        cron.schedule(Scheduler._schedules['ScheduleTimezoneUpdate'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: Update Current timezone...');
                var service = Loader.container.resolve(UserService);
                await service.updateCurrentTimezone();
            })();
        });
    };

    private scheduleExistingVitalDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingVitalDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingVitalDataToEHR]: Running scheduled jobs: Schedule to populate existing vitals data in EHR database...');
                var _ehrVitalService = new EHRVitalService();
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BloodPressure");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BloodGlucose");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BodyWeight");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BodyHeight");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BodyTemperature");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("BloodOxygenSaturation");
                await _ehrVitalService.scheduleExistingVitalDataToEHR("Pulse");
                Logger.instance().log('[ScheduleExistingVitalDataToEHR] : Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingLabDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingLabDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingLabDataToEHR]: Running scheduled jobs: Schedule to populate existing labs data in EHR database...');
                var _ehrLabService = new EHRLabService();
                await _ehrLabService.scheduleExistingLabDataToEHR();
                Logger.instance().log('[ScheduleExistingLabDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingPhysicalActivityDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingPhysicalActivityDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingPhysicalActivityDataToEHR]: Running scheduled jobs: Schedule to populate existing physical activities data in EHR database...');
                var _ehrPhysicalActivityService = new EHRPhysicalActivityService();
                await _ehrPhysicalActivityService.scheduleExistingPhysicalActivityDataToEHR("PhysicalActivity");
                await _ehrPhysicalActivityService.scheduleExistingPhysicalActivityDataToEHR("Stand");
                await _ehrPhysicalActivityService.scheduleExistingPhysicalActivityDataToEHR("StepCount");
                Logger.instance().log('[ScheduleExistingPhysicalActivityDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingMentalWellBeingDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingMentalWellBeingDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingMentalWellBeingDataToEHR]: Running scheduled jobs: Schedule to populate existing mental wellbeing data in EHR database...');
                var _ehrMentalWellBeingService = new EHRMentalWellBeingService();
                await _ehrMentalWellBeingService.scheduleExistingMentalWellBeingDataToEHR("Meditation");
                await _ehrMentalWellBeingService.scheduleExistingMentalWellBeingDataToEHR("Sleep");
                Logger.instance().log('[ScheduleExistingMentalWellBeingDataToEHR]: Cron schedule completed successfully');

            })();
        });
    };

    private scheduleExistingNutritionDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingNutritionDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingNutritionDataToEHR]: Running scheduled jobs: Schedule to populate existing nutritions data in EHR database...');
                var _ehrNutritionService = new EHRNutritionService();
                await _ehrNutritionService.scheduleExistingNutritionDataToEHR();
                Logger.instance().log('[ScheduleExistingNutritionDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingMedicationDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingMedicationDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingMedicationDataToEHR]: Running scheduled jobs: Schedule to populate existing medication data in EHR database...');
                var _ehrMedicationService = new EHRMedicationService();
                await _ehrMedicationService.scheduleExistingMedicationDataToEHR();
                Logger.instance().log('[ScheduleExistingMedicationDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingSymptomDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingSymptomDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingSymptomDataToEHR]: Running scheduled jobs: Schedule to populate existing symptoms data in EHR database...');
                var _ehrSymptomService = new EHRSymptomService();
                await _ehrSymptomService.scheduleExistingSymptomDataToEHR();
                Logger.instance().log('[ScheduleExistingSymptomDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingAssessmentDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingAssessmentDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingAssessmentDataToEHR]: Running scheduled jobs: Schedule to populate existing assessment data in EHR database...');
                var _ehrAssessmentService = new EHRAssessmentService();
                await _ehrAssessmentService.scheduleExistingAssessmentDataToEHR();
                Logger.instance().log('[ScheduleExistingAssessmentDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingCareplanActivityDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingCareplanActivityDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingCareplanActivityDataToEHR]: Running scheduled jobs: Schedule to populate existing careplan activity data in EHR database...');
                var _ehrCareplanActivityService = new EHRCareplanActivityService();
                await _ehrCareplanActivityService.scheduleExistingCareplanActivityDataToEHR();
                Logger.instance().log('[ScheduleExistingCareplanActivityDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingStaticDataToEHR = () => {
        cron.schedule(Scheduler._schedules['ScheduleExistingStaticDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingStaticDataToEHR]: Running scheduled jobs: Schedule to populate existing static data in EHR database...');
                var _ehrAnalyticsHandler = new EHRAnalyticsHandler();
                await _ehrAnalyticsHandler.scheduleExistingStaticDataToEHR();
                Logger.instance().log('[ScheduleExistingStaticDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    // private scheduleDaillyPatientTasks = () => {
    //     cron.schedule(Scheduler._schedules['PatientDailyTasks'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheducled jobs: Patient daily tasks...');
    //             var service = Loader.container.resolve(UserTaskService);

    //             await service.sendTaskReminders();
    //         })();
    //     });
    // };

    //#endregion

}
