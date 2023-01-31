import { TaskBase } from "../user.task/task.base";

export interface CustomTaskDomainModel extends TaskBase {
    id?       : string;
    Details?  : any;
}
