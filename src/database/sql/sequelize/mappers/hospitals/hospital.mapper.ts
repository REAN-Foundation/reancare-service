import Hospital from '../../models/hospitals/hospital.model';
import { HospitalDto }
    from '../../../../../domain.types/hospitals/hospital/hospital.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HospitalMapper {

    static toDto = (
        model: Hospital): HospitalDto => {
        if (model == null) {
            return null;
        }
        const dto: HospitalDto = {
            id               : model.id,
            HealthSystemId   : model.HealthSystemId,
            HealthSystemName : model.HealthSystem?.Name ?? null,
            Name             : model.Name,
            Tags             : model.Tags ? JSON.parse(model.Tags) : [],
            CreatedAt        : model.CreatedAt,
        };
        return dto;
    };

}
