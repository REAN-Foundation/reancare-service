
export interface ICarePlanTaskService {

    updateTask(taskModel: any): Promise<boolean>;
    updateBiometrics(taskModel: any): Promise<boolean>;
    //...
}
