import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { PatientDomainModel } from "../../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanTaskDto } from "../../domain.types/careplan.task.dto";
import { ICarePlanService } from "../../interfaces/careplan.service.interface";
import needle = require('needle');
import { Logger } from '../../../../common/logger';
import { AhaCache } from './aha.cache';
import Participant from "../../../../database/sql/sequelize/models/careplan/participant.model";
import { ParticipantMapper } from "../../../../database/sql/sequelize/mappers/participant.mapper";
import { ApiError } from "../../../../common/api.error";
import { IPersonRepo } from "../../../../database/repository.interfaces/person.repo.interface";
import { inject, injectable } from "tsyringe";
import { EnrollmentDomainModel } from "../../domain.types/enrollment/enrollment.domain.model";

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaCarePlanService implements ICarePlanService {

    constructor(@inject('IPersonRepo') private _personRepo: IPersonRepo) {}

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

    public registerPatient = async (patientDomainModel: PatientDomainModel): Promise<any> => {
        try {
            var existingParticipant = await Participant.findOne({ where: { UserId: patientDomainModel.UserId } });

            if (existingParticipant) {
                const dto = await ParticipantMapper.toDto(existingParticipant);
                return dto;
            }

            Logger.instance().log(`Person id: ${JSON.stringify(patientDomainModel)}`);

            if (!patientDomainModel.User.Person) {
                throw new ApiError(500, 'Unable to register participant as Person not found!');
            }

            var personDetails = await this._personRepo.getById(patientDomainModel.User.Person.id);

            Logger.instance().log(`Person Details: ${JSON.stringify(personDetails)}`);

            const entity = {
                UserId         : patientDomainModel.UserId,
                ParticipantId  : null,
                Name           : personDetails.FirstName,
                IsActive       : true,
                Gender         : personDetails.Gender,
                Age            : parseInt(personDetails.Age),
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
                userId   : entity.UserId,
            };

            if (entity.Name) {
                body['name'] = entity.Name;
            }

            var url = process.env.AHA_API_BASE_URL + '/participants';

            Logger.instance().log(`body: ${JSON.stringify(body)}`);

            var response = await needle('post', url, body, this.getHeaderOptions());
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error(
                    'Unable to register participant with AHA API service!',
                    response.statusCode,
                    null
                );
                return false;
            }

            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);
            entity.ParticipantId = response.body.data.participant.id;

            const participant = await Participant.create(entity);
            const dto = await ParticipantMapper.toDto(participant);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public enrollPatientToCarePlan = async (
        patientDomainModel: PatientDomainModel,
        enrollmentDomainModel: EnrollmentDomainModel
    ): Promise<any> => {
        try {
            var participantDetails = await Participant.findOne({ where: { UserId: patientDomainModel.UserId } });

            Logger.instance().log(`Participant details1: ${JSON.stringify(participantDetails)}`);

            if (!participantDetails) {
                participantDetails = await this.registerPatient(patientDomainModel);
            }

            if (!participantDetails) {
                throw new ApiError(500, 'Unable to register participant with careplan service');
            }
            Logger.instance().log(`Participant details2: ${JSON.stringify(participantDetails)}`);

            var enrollmentData = {
                userId       : participantDetails.UserId,
                PlanCode : enrollmentDomainModel.PlanCode,
                startAt      : enrollmentDomainModel.StartDate,
                endAt        : enrollmentDomainModel.EndDate,
                meta         : {
                    gender : participantDetails.Gender,
                },
            };

            Logger.instance().log(`Enrollment details: ${JSON.stringify(enrollmentData)}`);

            var url = process.env.AHA_API_BASE_URL + '/enrollments';

            var response = await needle('post', url, enrollmentData, this.getHeaderOptions());

            Logger.instance().log(`Enrollment response code: ${JSON.stringify(response.statusCode)}`);

            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to enroll patient with AHA API service!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);
            return response.body.data.enrollment;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    fetchTasksForDay(patientUserId: uuid, day: Date): Promise<CarePlanTaskDto[]> {
        throw new Error('Method not implemented.');
    }

    fetchTasks(id: string, startDate: Date, endDate: Date): Promise<any> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    getHeaderOptions() {
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
