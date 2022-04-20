import { HealthPriorityDomainModel } from '../../../../../domain.types/health.priority/health.priority.domain.model';
import { HealthPriorityDto } from '../../../../../domain.types/health.priority/health.priority.dto';
import { IHealthPriorityRepo } from '../../../../../database/repository.interfaces/health.priority/health.priority.repo.interface';
import HealthPriority from '../../models/health.priority/health.priority.model';
import { HealthPriorityMapper } from '../../mappers/health.priority/health.priority.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { HealthPriorityTypeDomainModel } from '../../../../../domain.types/health.priority.type/health.priority.type.domain.model';
import { HealthPriorityTypeDto } from '../../../../../domain.types/health.priority.type/health.priority.type.dto';
import HealthPriorityType    from '../../models/health.priority/health.priority.type.model';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class HealthPriorityRepo implements IHealthPriorityRepo {

    create = async (createModel: HealthPriorityDomainModel): Promise<HealthPriorityDto> => {
        try {
            const entity = {
                PatientUserId        : createModel.PatientUserId,
                Source               : createModel.Source,
                Provider             : createModel.Provider,
                ProviderEnrollmentId : createModel.ProviderEnrollmentId,
                ProviderCareplanCode : createModel.ProviderCareplanCode,
                ProviderCareplanName : createModel.ProviderCareplanName,
                HealthPriorityType   : createModel.HealthPriorityType,
                IsPrimary            : createModel.IsPrimary,
            };

            const healthPriority = await HealthPriority.create(entity);
            return HealthPriorityMapper.toDto(healthPriority);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPatientHealthPriorities = async (patientUserId: uuid): Promise<HealthPriorityDto[]> => {
        try {
            const priorities = await HealthPriority.findAll({
                where : { PatientUserId: patientUserId },
            });

            const dtos: HealthPriorityDto[] = [];
            for (const priority of priorities) {
                const dto = HealthPriorityMapper.toDto(priority);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    
    getPriorityTypes = async (): Promise<HealthPriorityTypeDto[]> => {
        try {
            const priorityTypes = await HealthPriorityType.findAll({});

            const dtos: HealthPriorityTypeDto[] = [];
            for (const priorityType of priorityTypes) {
                const dto = HealthPriorityMapper.toTypeDto(priorityType);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<HealthPriorityDto> => {
        try {
            const priority = await HealthPriority.findByPk(id);
            return HealthPriorityMapper.toDto(priority);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createType = async (model: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto> => {
        try {
            const entity = {
                Type : model.Type,
                Tags : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const priority = await HealthPriorityType.create(entity);
            return HealthPriorityMapper.toTypeDto(priority);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalTypesCount = async (): Promise<number> => {
        try {
            return await HealthPriorityType.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
