import { TenantService } from '../../services/tenant/tenant.service';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { TenantSearchFilters } from '../../domain.types/tenant/tenant.search.types';
import { TenantSettingsService } from '../../services/tenant/tenant.settings.service';
import { TimeHelper } from '../../common/time.helper';
import needle = require('needle');
import { DateStringFormat } from '../../domain.types/miscellaneous/time.types';
import { ScheduleFrequency, TenantSettingsDto } from '../../domain.types/tenant/tenant.settings.types';
import { FollowUpCancellationService } from '../../services/tenant/followups/cancellations/follow.up.cancellation.service';
import { FollowUpCancellationSearchFilters } from '../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types';

export class GGHNActions {

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _tenantSettingService: TenantSettingsService  = Injector.Container.resolve(TenantSettingsService);

    _followpCancellationService: FollowUpCancellationService = Injector.Container.resolve(FollowUpCancellationService);

    public scheduleGGHNFollowUpReminder = async () => {
        try {
            const filters: TenantSearchFilters = {
                Name : 'GGHN_HIVTB'
            };
            const tenant = await this._tenantService.search(filters);
            
            if (!tenant.RetrievedCount || tenant.RetrievedCount > 1){
                throw new Error('Found no client or found multiple client with the same name');
            }

            const isTodayValidForAppointmentFollowup = await this.isTodayValidForAppointmentFollowup(tenant.Items[0].id);

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

            const isDaily = this.isDailyFrequency(scheduleFrequency);

            if (isDaily) {
                this.triggerFollowupService();
                Logger.instance().log('RUNNING DAILY');
            }
            const isWeekly = this.isWeeklyFrequency(scheduleFrequency);
            
            if (isWeekly) {
                this.triggerFollowupService();
                Logger.instance().log('RUNNING WEEKLY');
            }

            const isMonthly = this.isMonthlyFrequency(scheduleFrequency);
            
            if (isMonthly) {
                this.triggerFollowupService();
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

            const dateToday = new Date(new Date().toISOString()
                .split('T')[0]);
          
            const filters: FollowUpCancellationSearchFilters = {
                TenantId   : id,
                CancelDate : dateToday
            };
            Logger.instance().log(`CancelDate... ${dateToday}`);
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
    
            needle('post', url, body, options);
            
        } catch (error) {
            Logger.instance().log(JSON.stringify(error.stack));
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
