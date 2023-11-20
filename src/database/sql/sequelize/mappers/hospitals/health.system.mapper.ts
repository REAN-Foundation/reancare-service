import HealthSystem from '../../models/hospitals/health.system.model';
import { HealthSystemDto } from '../../../../../domain.types/hospitals/health.system/health.system.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HealthSystemMapper {

    static toDto = (
        model: HealthSystem): HealthSystemDto => {
        if (model == null) {
            return null;
        }
        const dto: HealthSystemDto = {
            id        : model.id,
            Name      : model.Name,
            Tags      : model.Tags ? JSON.parse(model.Tags) : [],
            CreatedAt : model.CreatedAt,
        };
        return dto;
    };

}
