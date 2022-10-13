import { IHealthSystemRepo } from '../../../../../../database/repository.interfaces/users/patient/health.system.repo.interface';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HealthSystemDomainModel } from '../../../../../../domain.types/users/patient/health.system/health.system.domain.model';
import { HealthSystemDto } from '../../../../../../domain.types/users/patient/health.system/health.system.dto';
import { HealthSystemMapper } from '../../../mappers/users/patient/health.system.mapper';
import HealthSystem from '../../../models/users/patient/health.system.model';
import { HealthSystemHospitalDomainModel } from '../../../../../../domain.types/users/patient/health.system/health.system.hospital.domain.model';
import { HealthSystemHospitalDto } from '../../../../../../domain.types/users/patient/health.system/health.system.hospital.dto';
import HealthSystemHospital from '../../../models/users/patient/health.system.hospital.model';

///////////////////////////////////////////////////////////////////////

export class HealthSystemRepo implements IHealthSystemRepo {

    createHealthSystem = async (createModel: HealthSystemDomainModel):
    Promise<HealthSystemDto> => {
        try {
            const entity = {
                Name: createModel.Name,
            };

            const nutrition = await HealthSystem.create(entity);
            return await HealthSystemMapper.toDto(nutrition);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createHealthSystemHospital = async (createModel: HealthSystemHospitalDomainModel):
    Promise<HealthSystemHospitalDto> => {
        try {
            const entity = {
                HealthSystemId : createModel.HealthSystemId,
                Name           : createModel.Name,
            };

            const nutrition = await HealthSystemHospital.create(entity);
            return await HealthSystemMapper.toDetailsDto(nutrition);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalCount = async (): Promise<number> => {
        try {
            return await HealthSystem.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getHealthSystems = async (): Promise<HealthSystemDto[]> => {
        try {
            const filter = { where: {} };
            
            const healthSystems = await HealthSystem.findAll(filter);
            const dtos: HealthSystemDto[] = [];
            for (const hs of healthSystems) {
                const dto = HealthSystemMapper.toDto(hs);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
