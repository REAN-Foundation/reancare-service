import { HealthPriorityType } from "../../../../../domain.types/health.priority.type/health.priority.types";
import { HealthPriorityTypeDto } from "../../../../../domain.types/health.priority.type/health.priority.type.dto";
import { HealthPriorityDto } from "../../../../../domain.types/health.priority/health.priority.dto";
import HealthPriority from "../../models/health.priority/health.priority.model";
import HealthPriorityTypeModel from "../../models/health.priority/health.priority.type.model";

///////////////////////////////////////////////////////////////////////////////////

export class HealthPriorityMapper {

    static toDto = (healthPriority: HealthPriority): HealthPriorityDto => {

        if (healthPriority == null){
            return null;
        }

        const dto: HealthPriorityDto = {
            id                   : healthPriority.id,
            PatientUserId        : healthPriority.PatientUserId,
            Source               : healthPriority.Source,
            ProviderEnrollmentId : healthPriority.ProviderEnrollmentId,
            Provider             : healthPriority.Provider,
            ProviderCareplanName : healthPriority.ProviderCareplanName,
            ProviderCareplanCode : healthPriority.ProviderCareplanCode,
            HealthPriorityType   : healthPriority.HealthPriorityType as HealthPriorityType,
            StartedAt            : healthPriority.StartedAt,
            ScheduledEndDate     : healthPriority.ScheduledEndDate,
            IsPrimary            : healthPriority.IsPrimary,
        };
        
        return dto;
    };

    static toTypeDto = (healthPriorityType: HealthPriorityTypeModel): HealthPriorityTypeDto => {

        if (healthPriorityType == null){
            return null;
        }

        const typeDto: HealthPriorityTypeDto = {
            id   : healthPriorityType.id,
            Type : healthPriorityType.Type,
            Tags : healthPriorityType.Tags ? JSON.parse(healthPriorityType.Tags) : [],
        };
        
        return typeDto;
    };

}
