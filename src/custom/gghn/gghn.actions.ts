import { TenantService } from '../../services/tenant/tenant.service';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { TenantSearchFilters } from '../../domain.types/tenant/tenant.search.types';
import { TenantSettingsService } from '../../services/tenant/tenant.settings.service';
import { TimeHelper } from '../../common/time.helper';
import needle = require('needle');
import { DateStringFormat } from '../../domain.types/miscellaneous/time.types';
import { FollowUpCancellationService } from '../../services/follow.up/follow.up.cancellation.service';
import { FollowUpCancellationSearchFilters } from '../../domain.types/follow.up/follow.up.cancellation.search.types';
import { ScheduleFrequency, TenantSettingsDto } from '../../domain.types/tenant/tenant.settings.types';

export class GGHNActions {

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _tenantSettingService: TenantSettingsService  = Injector.Container.resolve(TenantSettingsService);

    _followpCancellationService: FollowUpCancellationService = Injector.Container.resolve(FollowUpCancellationService);

    public scheduleGGHNFollowUpReminder = async () => {
        try {
            const filters: TenantSearchFilters = {
                Name : 'GGHN_admin'
            };
            const tenant = await this._tenantService.search(filters);
            
            if (!tenant.RetrievedCount || tenant.RetrievedCount > 1){
                throw new Error('Found no client or found multiple client with the same name');
            }

            const isTodayValidForAppointmentFollowup = this.isTodayValidForAppointmentFollowup(tenant.Items[0].id);

            if (!isTodayValidForAppointmentFollowup) {
                Logger.instance().log(`Appointment followup is cancelled for the date : ${new Date().toISOString()} `);
                return;
            }

            const tenantSettings = await this._tenantSettingService.getTenantSettings(tenant.Items[0].id);
            
            const scheduleFrequency = await this.getAppointmentFollowUpSettings(tenantSettings);

            if (!scheduleFrequency) {
                Logger.instance().log(`Schedule trigger setting is not set!`);
                return;
            }
            // const appointmentFollowUpSettings = {
            //     UploadAppointmentDocument : false,
            //     AppointmentEhrApi         : false,
            //     AppointmentEhrApiDetails  : {
            //         CustomApi        : false,
            //         FhirApi          : false,
            //         CustomApiDetails : {
            //             Url         : null,
            //             Credentials : {
            //                 UserName : null,
            //                 Password : null,
            //             }
            //         },
            //         FhirApiDetails : {
            //             Url         : null,
            //             Credentials : {
            //                 UserName : null,
            //                 Password : null,
            //             }
            //         },
            //         FollowupMechanism : {
            //             ManualTrigger     : false,
            //             ScheduleTrigger   : true,
            //             ScheduleFrequency : {
            //                 Daily      : false,
            //                 Weekly     : false,
            //                 WeekDay    : "Tuesday",
            //                 Monthly    : true,
            //                 DayOfMonth : 24,
            //             },
            //             ScheduleTiming   : "10:00:00",
            //             FollowupMessages : false,
            //             MessageFrequency : {
            //                 OneDayBefore  : false,
            //                 OneHourBefore : false,
            //                 OneWeekBefore : false
            //             }
            //         }
            //     }
            // };
            
            const isDaily = this.isDailyFrequency(scheduleFrequency);

            if (isDaily) {
                await this.triggerFollowupService();
                Logger.instance().log('RUNNING DAILY');
            }
            const isWeekly = this.isWeeklyFrequency(scheduleFrequency);
            
            if (isWeekly) {
                await this.triggerFollowupService();
                Logger.instance().log('RUNNING WEEKLY');
            }

            const isMonthly = this.isMonthlyFrequency(scheduleFrequency);
            
            if (isMonthly) {
                await this.triggerFollowupService();
                Logger.instance().log('RUNNING MONTHLY');
            }
        }
        catch (error) {
            Logger.instance().log(`Error in scheduling appointment followup for GGHN: ${error}`);
        }
    };

    public isDailyFrequency = (scheduleFrequency: ScheduleFrequency): boolean => {
        return scheduleFrequency.Daily;
    };

    public isWeeklyFrequency = (scheduleFrequency: ScheduleFrequency): boolean => {
        if (!scheduleFrequency.Weekly) {
            return false;
        }

        const today = new Date();
        const todayDay = TimeHelper.getWeekday(today, false);
        const scheduledWeekDay = scheduleFrequency.WeekDay;
        return todayDay === scheduledWeekDay;
    };

    public isMonthlyFrequency = (scheduleFrequency: ScheduleFrequency) => {
        if (!scheduleFrequency.Monthly) {
            return false;
        }

        const today = new Date();
        const dayOfMonth = scheduleFrequency.DayOfMonth;
        const todayDay = today.getDate();

        return dayOfMonth === todayDay;
    };

    private isTodayValidForAppointmentFollowup = async (id: string): Promise<boolean> => {
        try {
            const filters: FollowUpCancellationSearchFilters = {
                TenantId   : id,
                CancelDate : new Date()
            };
            const cancellationSchedules = await this._followpCancellationService.search(filters);
            if (cancellationSchedules.TotalCount) {
                return false;
            }
            return true;
        } catch (error) {
            Logger.instance().log(`Error in followup schedule: ${JSON.stringify(error, null, 2)}`);
            return false;
        }
    };

    private triggerFollowupService = async (): Promise<void> => {
        try {
            const today = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            var headers = {
                'Content-Type'  : 'application/json',
                Accept          : '*/*',
                'Cache-Control' : 'no-cache',
                Connection      : 'keep-alive',
            };
    
            var options = {
                headers    : headers,
                compressed : true,
                json       : true,
            };
    
            var url = process.env.GGHN_API_BASE_URL + `/appointment-schedules/gghn/set-reminders/date/${today}`;
    
            var body = {};
    
            var response = await needle('post', url, body, options);
            Logger.instance().log(`Response from the GGHN API service: ${JSON.stringify(response, null, 2)}`);
            if (response.Status === 'success') {
                Logger.instance().log('Successfully scheduled GGHN appointment followup!');
            } else {
                Logger.instance().error('Unable to schedule GGHN appointment followup!', response.Message, null);
            }
        } catch (error) {
            Logger.instance().error('Error in schedule GGHN appointment followup!', error, null);
        }
        
    };

    private getAppointmentFollowUpSettings = (tenantSettings: TenantSettingsDto): ScheduleFrequency => {
        if (!tenantSettings) {
            return null;
        }

        if (!tenantSettings.ChatBot.AppointmentFollowup.AppointmentEhrApi)
        {
            return null;
        }

        if (!tenantSettings.ChatBot.AppointmentFollowup.AppointmentEhrApiDetails.FollowupMechanism.ScheduleTrigger) {
            return null;
        }
        return tenantSettings.ChatBot.AppointmentFollowup.AppointmentEhrApiDetails.FollowupMechanism.ScheduleFrequency;
    };

}
