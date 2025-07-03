import * as cron from 'node-cron';
import * as CronSchedules from '../../seed.data/cron.schedules.json';
import { Logger } from '../common/logger';
import { MedicationConsumptionService } from '../services/clinical/medication/medication.consumption.service';
import { FileResourceService } from '../services/general/file.resource.service';
import { Injector } from './injector';
import { CareplanService } from '../services/clinical/careplan.service';
import { CustomActionsHandler } from '../custom/custom.actions.handler';
import { CommunityNetworkService } from '../modules/community.bw/community.network.service';
import { ReminderSenderService } from '../services/general/reminder.sender.service';
import { TerraSupportService } from '../api/devices/device.integrations/terra/terra.support.controller';
import { UserService } from '../services/users/user/user.service';
import { RunOnceScheduler } from '../modules/run.once.scripts/run.once.scheduler';
import { DailyStatisticsService } from '../services/statistics/daily.statistics.service';
import { ActivityTrackerHandler } from '../services/users/patient/activity.tracker/activity.tracker.handler';

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
                //this.scheduleMonthlyCustomTasks();
                this.scheduleDailyCareplanPushTasks();
                this.scheduleDailyHighRiskCareplan();
                // this.scheduleHsSurvey();
                this.scheduleReminderOnNoActionToDonationRequest();
                this.scheduleReminders();
                this.scheduleCareplanRegistrationReminders();
                this.scheduleFetchDataFromDevices();
                this.scheduleCurrentTimezoneUpdate();
                this.scheduleDailyStatistics();
                // this.scheduleStrokeSurvey();
                // this.scheduleStrokeSurveyTextMessage();
                
                //this.scheduleDaillyPatientTasks();
                this.scheduleCareplanRegistrationRemindersForOldUsers();
                // this.scheduleHFHelperTextMessage();
                this.scheduleGGHNFollowUpReminder();
                this.scheduleUserActivityTracker();
                this.scheduleNotificationToInactiveUsers();
                this.scheduleCreateMedicationConsumptionTask();

                const runOnceScheduler = RunOnceScheduler.instance();
                runOnceScheduler.schedule(Scheduler._schedules);

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
                const dailyStatsService = Injector.Container.resolve(DailyStatisticsService);
                await dailyStatsService.generateDailySystemStats();
                await dailyStatsService.generateDailyStatsForAllTenants();
            })();
        });
    };

    private scheduleFileCleanup = () => {
        cron.schedule(Scheduler._schedules['FileCleanup'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: temp file clean-up...');
                var service = Injector.Container.resolve(FileResourceService);
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
                var service = Injector.Container.resolve(MedicationConsumptionService);
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
            //     var service = Injector.Container.resolve(MedicationConsumptionService);
            //     var upcomingInMinutes = 60 * 24 * 2;
            //     var count = await service.createMedicationTasks(upcomingInMinutes);
            //     Logger.instance().log(`Total ${count} new medication tasks created.`);
            // })();
        });
    };

    /*private scheduleMonthlyCustomTasks = () => {
        cron.schedule(Scheduler._schedules['ScheduleCustomTasks'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Custom Tasks...');
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduledMonthlyRecurrentTasks();
            })();
        });
    };*/

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
                var customActionHandler = new CustomActionsHandler();
                await customActionHandler.scheduleDailyCareplanPushTasks();
            })();
        });
    };

    private scheduleDailyHighRiskCareplan = () => {
        cron.schedule(Scheduler._schedules['ScheduleDailyHighRiskCareplan'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Daily High Risk Careplan...');
                const careplanService = Injector.Container.resolve(CareplanService);
                await careplanService.scheduleDailyHighRiskCareplan();
            })();
        });
    };

    //Shut down - Cholesterol survey text mesages on August 12, 2024
    // private scheduleHsSurvey = () => {
    //     cron.schedule(Scheduler._schedules['ScheduleHsSurvey'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheduled jobs: Schedule Custom HS Survey Tasks...');
    //             var customActionHandler = new CustomActionsHandler();
    //             await customActionHandler.scheduleHsSurvey();
    //         })();
    //     });
    // };

    //Shut down - Stroke survey text mesages on June 17, 2025
    // private scheduleStrokeSurvey = () => {
    //     cron.schedule(Scheduler._schedules['ScheduleStrokeSurvey'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheduled jobs: Schedule Stroke Survey notification...');
    //             var customActionHandler = new CustomActionsHandler();
    //             await customActionHandler.scheduleStrokeSurvey();
    //         })();
    //     });
    // };

    //Shut down - Stroke survey text mesages on June 17, 2025
    // private scheduleStrokeSurveyTextMessage = () => {
    //     cron.schedule(Scheduler._schedules['ScheduleStrokeSurveyTextMessage'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheduled jobs: Schedule Stroke Survey text message...');
    //             var customActionHandler = new CustomActionsHandler();
    //             await customActionHandler.scheduleStrokeSurveyTextMessage();
    //         })();
    //     });
    // };

    private scheduleReminderOnNoActionToDonationRequest = () => {
        cron.schedule(Scheduler._schedules['ReminderOnNoActionToDonationRequest'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Schedule Reminder On No Action To Donation Requests...');
                var communityNetworkService = Injector.Container.resolve(CommunityNetworkService);
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
                var service = Injector.Container.resolve(UserService);
                await service.updateCurrentTimezone();
            })();
        });
    };

    //Shut down - HF helper retirement message on September 15, 2024
    // private scheduleHFHelperTextMessage = () => {
    //     cron.schedule(Scheduler._schedules['ScheduleHFHelperTextMessage'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheduled jobs: Schedule HF Helper SMS...');
    //             var customActionHandler = new CustomActionsHandler();
    //             await customActionHandler.scheduleHFHelperTextMessage();
    //         })();
    //     });
    // };

    private scheduleGGHNFollowUpReminder  = () => {
        cron.schedule(Scheduler._schedules['ScheduleGGHNFollowUpReminder'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: GGHNFollowUpReminder...');
                var customActionHandler = new CustomActionsHandler();
                customActionHandler.scheduleGGHNFollowUpReminder();
            })();
        });
    };

    // private scheduleDaillyPatientTasks = () => {
    //     cron.schedule(Scheduler._schedules['PatientDailyTasks'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheducled jobs: Patient daily tasks...');
    //             var service = Injector.Container.resolve(UserTaskService);

    //             await service.sendTaskReminders();
    //         })();
    //     });
    // };

    private scheduleNotificationToInactiveUsers  = () => {
        cron.schedule(Scheduler._schedules['scheduleNotificationToInactiveUsers'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs:one month inactive user text reminder...');
                var customActionHandler = new CustomActionsHandler();
                customActionHandler.scheduleNotificationToInactiveUsers();
            })();
        });
    };
    
    private scheduleUserActivityTracker = () => {
        cron.schedule(Scheduler._schedules['UserActivityTracker'], () => {
            (async () => {
                const now = new Date();
                const targetDate = new Date("2025-02-01");
                if (now < targetDate) {
                    Logger.instance().log('Running scheduled jobs: User Activity Tracker...');
                    var service = Injector.Container.resolve(ActivityTrackerHandler);
                    await service.userActivityTracker();
                }
                
            })();
        });
    };

    private scheduleCreateMedicationConsumptionTask = () => {
        cron.schedule(Scheduler._schedules['CreateMedicationConsumptionTask'], () => {
            (async () => {
                Logger.instance().log('Running scheduled jobs: Create Medication Consumption Task...');
                var customActionHandler = new CustomActionsHandler();
                customActionHandler.scheduleCreateMedicationConsumptionTask(Scheduler._schedules['CreateMedicationConsumptionTask']);
            })();
        });
    };
    
    //#endregion

}
