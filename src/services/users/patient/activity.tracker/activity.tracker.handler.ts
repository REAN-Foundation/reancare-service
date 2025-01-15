import { injectable } from 'tsyringe';
import { ActivityTrackerDomainModel } from '../../../../domain.types/users/patient/activity.tracker/activity.tracker.domain.model';
import { ActivityTrackerDto, MostRecentActivityDto } from '../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';
import * as asyncLib from 'async';
import PatientActivityTracker from '../../../../database/sql/sequelize/models/users/patient/activity.tracker.model';
import { ActivityTrackerMapper } from '../../../../database/sql/sequelize/mappers/users/patient/activity.tracker.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { Op } from 'sequelize';
import { UserService } from '../../user/user.service';
import { Injector } from '../../../../startup/injector';
import { UserTaskService } from '../../user/user.task.service';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { BodyTemperatureService } from '../../../../services/clinical/biometrics/body.temperature.service';
import { BodyWeightService } from '../../../../services/clinical/biometrics/body.weight.service';
import { BodyHeightService } from '../../../../services/clinical/biometrics/body.height.service';
import { PulseService } from '../../../../services/clinical/biometrics/pulse.service';
import { BloodOxygenSaturationService } from '../../../../services/clinical/biometrics/blood.oxygen.saturation.service';
import { BloodPressureService } from '../../../../services/clinical/biometrics/blood.pressure.service';
import { CareplanService } from '../../../../services/clinical/careplan.service';
import { CareplanCode } from '../../../../domain.types/statistics/aha/aha.type';
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ActivityTrackerHandler {

    private _userService: UserService = Injector.Container.resolve(UserService);

    private _careplanService: CareplanService = Injector.Container.resolve(CareplanService);

    private _userTaskService: UserTaskService = Injector.Container.resolve(UserTaskService);

    private _bloodGlucoseService: BloodGlucoseService = Injector.Container.resolve(BloodGlucoseService);

    private _bloodOxygenSaturationService: BloodOxygenSaturationService =
    Injector.Container.resolve(BloodOxygenSaturationService);

    private _bloodPressureService: BloodPressureService = Injector.Container.resolve(BloodPressureService);

    private _bodyTemperatureService: BodyTemperatureService = Injector.Container.resolve(BodyTemperatureService);

    private _bodyWeightService: BodyWeightService = Injector.Container.resolve(BodyWeightService);

    private _bodyHeightService: BodyHeightService = Injector.Container.resolve(BodyHeightService);

    private _pulseService: PulseService = Injector.Container.resolve(PulseService);

    private static _numAsyncTasks = 4;

    static create = async (patientUserId: string, recentActivityDate: Date): Promise<ActivityTrackerDto> => {

        try {
            const entity = {
                id                 : patientUserId,
                RecentActivityDate : recentActivityDate ?? null,
            };
            const activityTracker = await PatientActivityTracker.create(entity);
            return ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private static getByPatientUserId = async (id: string): Promise<ActivityTrackerDto> => {
        try {
            const activityTracker = await PatientActivityTracker.findByPk(id);
            return await ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private static update = async (id: string, updateModel: ActivityTrackerDomainModel): Promise<ActivityTrackerDto> => {
        try {
            const activityTracker = await PatientActivityTracker.findByPk(id);
        
            if (updateModel.RecentActivityDate != null) {
                activityTracker.RecentActivityDate = updateModel.RecentActivityDate;
            }
        
            await activityTracker.save();
        
            return ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

     searchInactiveUsers = async (recentActivityDateFrom: Date, recentActivityDateTo: Date): Promise<string[]> => {
         try {
             const inactiveUserIds = await PatientActivityTracker.findAll({
                 attributes : ['id'],
                 where      : {
                     RecentActivityDate : {
                         [Op.between] : [recentActivityDateFrom, recentActivityDateTo]
                     }
                 }
             });
             return inactiveUserIds.map((inactiveUser) => inactiveUser.id);
         } catch (error) {
             Logger.instance().log(error.message);
             throw new ApiError(500, error.message);
         }
     };
    
    private static addOrUpdate = async (activity: ActivityTrackerDomainModel): Promise<void> => {
        try {
            const activty = await ActivityTrackerHandler.getByPatientUserId(activity.PatientUserId);

            if (activty) {
                await ActivityTrackerHandler.update(activity.PatientUserId, activity);
            }
            // else {
            //     await ActivityTrackerHandler.create(activity.PatientUserId, activity.RecentActivityDate);
            // }
        }
        catch (error) {
            Logger.instance().log(`Error adding or updating activity track record for patient user ${activity.PatientUserId}: ${error.message}`);
        }
    };
    
    public static addOrUpdateActivity(activity: ActivityTrackerDomainModel): void {
        ActivityTrackerHandler._addOrUpdateActivityQueue.push(activity, (err) => {
            if (err) {
                Logger.instance().log('Error adding or updating activity track record:' + err.message);
            }
        });
    }

    private static _addOrUpdateActivityQueue = asyncLib.queue((activity: ActivityTrackerDomainModel, onCompleted) => {
        (async () => {
            await ActivityTrackerHandler.addOrUpdate(activity);
            onCompleted();
        })();
    }, ActivityTrackerHandler._numAsyncTasks);

    public userActivityTracker = async () => {
        try {
            Logger.instance().log('Started user activity tracker...');

            const users = await this.getAllUsers();

            for await (const user of users) {

                const recentUserTaskActivity =  await this._userTaskService.getMostRecentUserActivity(user.PatientUserId);
                
                const vitalActivities = await this.getRecentVitalActivity(user.PatientUserId);

                const recentUserVitalActivity = this.getMostRecentUserActivity(vitalActivities);

                const recentUserActivity = this.getMostRecentUserActivity(
                    [user,recentUserTaskActivity,recentUserVitalActivity].filter(activity => activity !== null));

                await this.createActvityTrackRecord(recentUserActivity);
                  
            }
            Logger.instance().log('Ended user activity tracker...');

        } catch (error) {
            Logger.instance().log(error);
        }
    };

    private getAllUsers = async (): Promise<MostRecentActivityDto[]> => {
        try {
            const users =  await this._userService.getRecentUserActivity();

            const userEnrollments = await this._careplanService.getAllCareplanEnrollmentByPlanCode(CareplanCode.Stroke);

            const enrollments = userEnrollments.map(enrollment => enrollment.PatientUserId);

            const strokeUsers = users.filter(user =>
                enrollments.includes(user.PatientUserId)
            );

            return strokeUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            return [];
        }
        
    };

    private getRecentVitalActivity = async (userId: string): Promise<MostRecentActivityDto[]> => {
        const recentGlucoseActivity = await this._bloodGlucoseService.getMostRecentBloodGlucoseActivity(userId);
        const recentOxygenSaturationActivity = await this._bloodOxygenSaturationService.
            getMostRecentBloodOxygenSaturationActivity(userId);
        const recentBloodPressureActivity = await this._bloodPressureService.getMostRecentBloodPressureActivity(userId);
        const recentBodyTemperatureActivity = await this._bodyTemperatureService.getMostRecentBodyTemperatureActivity(
            userId);
        const recentWeightActivity = await this._bodyWeightService.getMostRecentBodyWeightActivity(userId);
        const recentHeightActivity = await this._bodyHeightService.getMostRecentBodyHeightActivity(userId);
        const recentPulseRateActivity = await this._pulseService.getMostRecentPulseActivity(userId);

        const activities: MostRecentActivityDto[] = [
            recentGlucoseActivity,
            recentOxygenSaturationActivity,
            recentBloodPressureActivity,
            recentBodyTemperatureActivity,
            recentWeightActivity,
            recentHeightActivity,
            recentPulseRateActivity].filter(activity => activity !== null);

        if (!activities || activities.length === 0) {
            return null;
        }
        
        return activities;
    };

    private getMostRecentUserActivity = (activities: MostRecentActivityDto[]): MostRecentActivityDto => {
        if (!activities || activities.length === 0) {
            return null;
        }
    
        if (activities.length === 1) {
            return activities[0];
        }
    
        return activities.reduce((mostRecent, current) => {
            if (!current.RecentActivityDate) {
                return mostRecent;
            }
            if (!mostRecent?.RecentActivityDate || current.RecentActivityDate > mostRecent.RecentActivityDate) {
                return current;
            }
            return mostRecent;
        }, null as MostRecentActivityDto | null);
    };

    private createActvityTrackRecord = async (createModel: MostRecentActivityDto) => {
        
        try {
            await ActivityTrackerHandler.create(createModel.PatientUserId, createModel.RecentActivityDate);
        }
        catch (error) {
            Logger.instance().log(`Unable to create activity tracker record for user ${createModel.PatientUserId}: ${error.message}`);
        }
        
    };

    private getActivityTrackerDomainModel = (
        userId: string,
        recentUserLoginActivity: MostRecentActivityDto,
        recentUserTaskActivity: MostRecentActivityDto,
        recentUserVitalActivity: MostRecentActivityDto,
        recentUserActivity: MostRecentActivityDto) => {

        const activityTrackerDomainModel: ActivityTrackerDomainModel = {
            PatientUserId : userId,
        };
    
        if (recentUserLoginActivity) {
            activityTrackerDomainModel.RecentActivityDate = recentUserLoginActivity.RecentActivityDate ?? null;
        }
        if (recentUserTaskActivity) {
            activityTrackerDomainModel.RecentActivityDate = recentUserTaskActivity.RecentActivityDate ?? null;
        }
    
        if (recentUserVitalActivity) {
            activityTrackerDomainModel.RecentActivityDate = recentUserVitalActivity.RecentActivityDate ?? null;
        }
        if (recentUserActivity) {
            activityTrackerDomainModel.RecentActivityDate = recentUserActivity.RecentActivityDate ?? null;
        }
        return activityTrackerDomainModel;
        
    };
    //#endregion
    
}
