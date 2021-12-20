import { UserTaskDto } from "../../../domain.types/user/user.task/user.task.dto";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface CarePlanTaskDto extends UserTaskDto{
    ProviderTaskId?: string|number;
    CareplanId      : uuid;    //REANCare Care-plan isntance id
    Provider: string;  //AHA
    PlanName    : string;  //AHA-HF
}
