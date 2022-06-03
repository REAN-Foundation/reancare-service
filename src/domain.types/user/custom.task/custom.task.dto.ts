import { TaskBase } from "../user.task/task.base";

export interface CustomTaskDto extends TaskBase {
    id?       : string;
    Details?  : any;
}
