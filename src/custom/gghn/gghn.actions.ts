import { TenantService } from '../../services/tenant/tenant.service';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { TenantSearchFilters } from '../../domain.types/tenant/tenant.search.types';
import { TenantSettingsService } from '../../services/tenant/tenant.settings.service';
import { TimeHelper } from '../../common/time.helper';
import needle = require('needle');
import { DateStringFormat } from '../../domain.types/miscellaneous/time.types';
import { FollowupSource, ScheduleFrequency, TenantSettingsDto } from '../../domain.types/tenant/tenant.settings.types';
import { FollowUpCancellationService } from '../../services/tenant/followups/cancellations/follow.up.cancellation.service';

///////////////////////////////////////////////////////////////////////////////

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
            const tenantCode = tenant.Items[0].Code;
            const isTodayValidForAppointmentFollowup = await this.isTodayValidForAppointmentFollowup(tenantCode);

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
                this.triggerFollowupScheduling(tenantCode);
                Logger.instance().log('RUNNING DAILY');
            }
            const isWeekly = this.isWeeklyFrequency(scheduleFrequency);
            
            if (isWeekly) {
                this.triggerFollowupScheduling(tenantCode);
                Logger.instance().log('RUNNING WEEKLY');
            }

            const isMonthly = this.isMonthlyFrequency(scheduleFrequency);
            
            if (isMonthly) {
                this.triggerFollowupScheduling(tenantCode);
                Logger.instance().log('RUNNING MONTHLY');
            }
        }
        catch (error) {
            Logger.instance().log(`Error in scheduling appointment followup for GGHN: ${error}`);
        }
    };

    public isDailyFrequency = (scheduleFrequency: ScheduleFrequency): boolean => {
        return scheduleFrequency === ScheduleFrequency.Daily;
    };

    public isWeeklyFrequency = (scheduleFrequency: ScheduleFrequency): boolean => {
        if (scheduleFrequency !== ScheduleFrequency.Weekly) {
            return false;
        }
        const scheduledWeekDay = 'Monday';
        const today = new Date();
        const todayDay = TimeHelper.getWeekday(today, false);
        return todayDay === scheduledWeekDay;
    };

    public isMonthlyFrequency = (scheduleFrequency: ScheduleFrequency) => {
        if (scheduleFrequency !== ScheduleFrequency.Monthly) {
            return false;
        }

        const today = new Date();
        const dayOfMonth = 1;
        const todayDay = today.getDate();

        return dayOfMonth === todayDay;
    };

    private isTodayValidForAppointmentFollowup = async (tenantCode: string): Promise<boolean> => {
        try {
            const dateToday = new Date().toISOString().
                split('T')[0];
            const filters = {
                tenant_code : tenantCode,
                cancel_date : dateToday
            };
            Logger.instance().log(`CancelDate... ${dateToday}`);
            const cancellationSchedules = await this.searchCancellations(filters);
            if (cancellationSchedules.TotalCount) {
                return false;
            }
            return true;
        } catch (error) {
            Logger.instance().log(`Error in followup schedule: ${JSON.stringify(error, null, 2)}`);
            return false;
        }
    };

    private triggerFollowupScheduling = async (tenantCode : string): Promise<void> => {
        try {
            const today = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            const endpoint = `/appointment-schedules/${tenantCode}/fetch-schedules-by-api`;
            const body = { reminder_date: today };

            await this.sendHttpRequest(endpoint, 'post', body);
            
        } catch (error) {
            Logger.instance().log(JSON.stringify(error.stack));
            Logger.instance().error(`Error in schedule appointment followup for ${tenantCode}!`, error, null);
        }
        
    };

    private searchCancellations = async (filters): Promise <any> => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = `/appointment-cancellations/search?${queryParams}`;
            const response = await this.sendHttpRequest(endpoint, 'get');
            return response.Data;
        } catch (error) {
            Logger.instance().log(JSON.stringify(error.stack));
            Logger.instance().error('Error in search cancellation records for appointment followup', error, null);
        }
        
    };

    private getAppointmentFollowUpSettings = (tenantSettings: TenantSettingsDto): ScheduleFrequency => {
        if (!tenantSettings) {
            return null;
        }

        if (!tenantSettings.ChatBot?.AppointmentFollowup ||
            tenantSettings.Followup.Source === FollowupSource.None ||
            tenantSettings.Followup.Source === FollowupSource.File) {
            return null;
        }

        return tenantSettings.Followup?.ApiIntegrationSettings?.ScheduleFrequency || null;

    };

    private buildRequestOptions(endpoint: string) {
        const baseUrl = process.env.FOLLOW_UP_BASE_URL;
        if (!baseUrl) {
            throw new Error('FOLLOW_UP_BASE_URL is not defined');
        }

        const url = `${baseUrl}${endpoint}`;

        const headers = {
            'Content-Type'  : 'application/json',
            Accept          : '*/*',
            'Cache-Control' : 'no-cache',
            Connection      : 'keep-alive'
        };

        const options: needle.NeedleOptions = {
            headers,
            compressed : true
        };

        return { url, options };
    }

    private async sendHttpRequest(
        endpoint: string,
        method: HttpMethod = 'post',
        payload: Record<string, any> = {}
    ): Promise<HttpResponseData> {
        const { url, options } = this.buildRequestOptions(endpoint);

        try {
            const methodMap: Record<HttpMethod, () => Promise<needle.NeedleResponse>> = {
                get    : () => needle('get', url, options),
                post   : () => needle('post', url, payload, options),
                put    : () => needle('put', url, payload, options),
                delete : () => needle('delete', url, options)
            };

            const response = await methodMap[method]();

            if (response.status && response.status === 'error') {
                Logger.instance().log(`HTTP ${method.toUpperCase()} request to ${url} failed`);
            }

            return response.body as HttpResponseData;
        } catch (error: any) {
            Logger.instance().error(`HTTP ${method.toUpperCase()} request to ${url} failed`, error, null);
            throw error;
        }
    }

}

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface HttpResponseData {
  Status: string;
  Message: string;
  Data: any;
}
