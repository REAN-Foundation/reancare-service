import { UserTaskDto } from "../../../users/user.task/user.task.dto";
import { uuid } from "../../../miscellaneous/system.types";

export interface CarePlanTaskDto extends UserTaskDto{
    ProviderTaskId?: string|number;
    CareplanId      : uuid;    //REANCare Care-plan isntance id
    Provider: string;  //AHA
    PlanName    : string;  //AHA-HF
}
