import { ICareplanService } from "../../interfaces/careplan.service.interface";
import needle = require('needle');
import { Logger } from '../../../../common/logger';
import { AhaCache } from './aha.cache';
import { ApiError } from "../../../../common/api.error";
import { injectable } from "tsyringe";
import { EnrollmentDomainModel } from "../../domain.types/enrollment/enrollment.domain.model";
import { Helper } from "../../../../common/helper";
import { CareplanActivity } from "../../domain.types/activity/careplan.activity";
import { ParticipantDomainModel } from "../../domain.types/participant/participant.domain.model";
import { CareplanActivityDetails } from "../../domain.types/activity/careplan.activity.details.dto";

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaCareplanService implements ICareplanService {

    public providerName(): string {
        return "AHA";
    }

    public init = async (): Promise<boolean> => {
        try {
            var headers = {
                'Content-Type'    : 'application/x-www-form-urlencoded',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
            };

            var options = {
                headers    : headers,
                compressed : true,
                json       : false,
            };

            var url = process.env.AHA_API_BASE_URL + '/token';

            var body = {
                client_id     : process.env.AHA_CONTINUITY_CLIENT_ID,
                client_secret : process.env.AHA_CONTINUITY_CLIENT_SECRET,
                grant_type    : 'client_credentials',
            };

            var response = await needle('post', url, body, options);
            if (response.statusCode === 200) {
                AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
                Logger.instance().log(
                    'Successfully connected to AHA API service!' +
                        AhaCache.GetWebToken() +
                        ' Expires On: ' +
                        AhaCache.GetTokenExpirationTime()
                );
                return true;
            } else {
                Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
                return false;
            }
        } catch (error) {
            Logger.instance().log('Error initializing AHA careplan API service.');
        }
    };

    public registerPatient = async (patientDetails: ParticipantDomainModel): Promise<string> => {
        try {
            const entity = {
                PatientUserId  : patientDetails.PatientUserId,
                Name           : patientDetails.Name,
                IsActive       : true,
                Gender         : patientDetails.Gender,
                Age            : patientDetails.Age,
                DOB            : null,
                HeightInInches : null,
                WeightInLbs    : null,
                MaritalStatus  : null,
                ZipCode        : null,
            };

            var meta = {};

            if (entity.Age) {
                meta['age'] = entity.Age;
            }
            if (entity.DOB) {
                meta['dob'] = entity.DOB;
            }
            if (entity.Gender) {
                meta['gender'] = entity.Gender;
            }
            if (entity.HeightInInches) {
                meta['heightInInches'] = entity.HeightInInches;
            }
            if (entity.MaritalStatus) {
                meta['maritalStatus'] = entity.MaritalStatus;
            }
            if (entity.WeightInLbs) {
                meta['weightInLbs'] = entity.WeightInLbs;
            }
            if (entity.ZipCode) {
                meta['zipCode'] = entity.ZipCode;
            }

            var body = {
                isActive : 1,
                meta     : meta,
                userId   : entity.PatientUserId,
            };

            if (entity.Name) {
                body['name'] = entity.Name;
            }

            var url = process.env.AHA_API_BASE_URL + '/participants';

            //Logger.instance().log(`body: ${JSON.stringify(body)}`);

            var response = await needle('post', url, body, this.getHeaderOptions());
            if (response.statusCode !== 200) {
                Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }
            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);
            return response.body.data.participant.id;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public enrollPatientToCarePlan = async (
        model: EnrollmentDomainModel): Promise<string> => {
        try {
            var enrollmentData = {
                userId       : model.PatientUserId,
                careplanCode : model.PlanCode,
                startAt      : model.StartDate,
                endAt        : model.EndDate,
                meta         : {
                    gender : model.Gender,
                },
            };

            var url = process.env.AHA_API_BASE_URL + '/enrollments';

            var response = await needle('post', url, enrollmentData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);

            return response.body.data.enrollment.id;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public fetchActivities = async (
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date): Promise<CareplanActivity[]> => {
        try {
        
            var startDate = Helper.formatDate(fromDate);
            var endDate = Helper.formatDate(toDate);
    
            Logger.instance().log(`Start Date: ${(startDate)}`);
            Logger.instance().log(`End Date: ${(endDate)}`);
    
            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
            const url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities?fromDate=${startDate}&toDate=${endDate}&pageSize=500`;
            
            var response = await needle("get", url, this.getHeaderOptions());
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch tasks for given enrollment id!', response.statusCode, null);
                throw new ApiError(500, "Careplan service error: " + response.body.error.message);
            }
    
            // AHA response has incorrect spelling of activities: "activitites"
            Logger.instance().log(`response body for activities: ${JSON.stringify(response.body.data.activitites.length)}`);
            var activities = response.body.data.activitites;
            var activityEntities: CareplanActivity[] = [];
            activities.forEach(activity => {
                var entity: CareplanActivity = {
                    Provider         : this.providerName(),
                    Type             : activity.type,
                    ProviderActionId : activity.code,
                    Title            : activity.title,
                    ScheduledAt      : activity.scheduledAt,
                    Sequence         : activity.sequence,
                    Frequency        : activity.frequency,
                    Status           : activity.status,
                };
                activityEntities.push(entity);
            });

            return activityEntities;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public getActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActionId: string): Promise<CareplanActivityDetails> => {
        try {

            Logger.instance().log(`Fetching activity for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
    
            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActionId}`;
    
            Logger.instance().log(`URL: ${JSON.stringify(url)}`);
    
            var response = await needle("get", url, this.getHeaderOptions());
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }
    
            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
    
            var activityDetails = response.body.data.activity;
    
            var entity: CareplanActivityDetails = {
                Type        : activityDetails.type ?? "",
                Name        : activityDetails.name ?? "",
                Text        : activityDetails.text ?? "",
                Status      : activityDetails.status ?? "",
                Description : activityDetails.description ?? "",
                URL         : activityDetails.url ?? "",
                Category    : activityDetails.category ?? [],
                Items       : activityDetails.items ?? [],
            };
    
            return entity;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public updateActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActivityId: string,
        updates: any): Promise<CareplanActivity> => {
        try {

            Logger.instance().log(`Updating activity for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActivityId}`;

            Logger.instance().log(`URL: ${JSON.stringify(url)}`);

            var updateData = {
                completedAt : Helper.formatDate(updates.completedAt),
                comments    : updates.comments ?? "",
                status      : updates.status,
            };

            var response = await needle("patch", url, updateData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
            var activity = response.body.data.activity;

            var entity: CareplanActivity = {
                Provider         : this.providerName(),
                Type             : activity.type,
                ProviderActionId : activity.code,
                Title            : activity.title,
                ScheduledAt      : activity.scheduledAt,
                Sequence         : activity.sequence,
                Frequency        : activity.frequency,
                Status           : activity.status,
                CompletedAt      : activity.completedAt,
                Comments         : activity.comments,
            };

            return entity;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public updateBiometricsActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActionId: string,
        updates: any): Promise<CareplanActivity> => {
        try {

            Logger.instance().log(`Fetching activities for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActionId}`;

            Logger.instance().log(`URL: ${JSON.stringify(url)}`);

            var updateData = {
                completedAt : Helper.formatDate(updates.completedAt),
                comments    : updates.comments ?? "",
                status      : updates.status,
            };

            var response = await needle("patch", url, updateData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
            var activity = response.body.data.activity;

            var entity: CareplanActivity = {
                Provider         : this.providerName(),
                Type             : activity.type,
                ProviderActionId : activity.code,
                Title            : activity.title,
                ScheduledAt      : activity.scheduledAt,
                Sequence         : activity.sequence,
                Frequency        : activity.frequency,
                Status           : activity.status,
                CompletedAt      : activity.completedAt,
                Comments         : activity.comments,
            };

            return entity;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    private getHeaderOptions() {
        var headers = {
            'Content-Type' : 'application/json',
            accept         : 'application/json',
            Authorization  : 'Bearer ' + AhaCache.GetWebToken(),
        };

        var options = {
            headers : headers,
        };

        return options;
    }

}
