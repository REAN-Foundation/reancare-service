import HealthSystem from '../../../models/users/patient/health.system.model';
import { HealthSystemDto } from '../../../../../../domain.types/users/patient/health.system/health.system.dto';
import HealthSystemHospital from '../../../models/users/patient/health.system.hospital.model';
import { HealthSystemHospitalDto } from
    '../../../../../../domain.types/users/patient/health.system/health.system.hospital.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HealthSystemMapper {

    static toDto = (
        model: HealthSystem): HealthSystemDto => {
        if (model == null) {
            return null;
        }
        const dto: HealthSystemDto = {
            id   : model.id,
            Name : model.Name,
        };
        return dto;
    };

    static toDetailsDto = (
        model: HealthSystemHospital): HealthSystemHospitalDto => {
        if (model == null) {
            return null;
        }
        const dto: HealthSystemHospitalDto = {
            id             : model.id,
            HealthSystemId : model.HealthSystemId,
            Name           : model.Name,
        };
        return dto;
    };

    

}
