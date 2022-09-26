import { UserActionType } from "../../../domain.types/users/user.task/user.task.types";
import { Loader } from "../../../startup/loader";
import { MedicationConsumptionService } from "../../clinical/medication/medication.consumption.service";
import { CareplanService } from "../../clinical/careplan.service";
import { CustomTaskService } from "./custom.task.service";
import { IUserActionService } from "./user.action.service.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UserActionResolver {

    //#region Methods to be called from UserTaskService

    getAction = async (
        actionType: string,
        actionId: uuid): Promise<any> => {
        var actionService = this.getActionService(actionType);
        return await actionService?.getAction(actionId);
    };

    startAction = async (
        actionType: string,
        actionId: uuid): Promise<boolean> => {
        var actionService = this.getActionService(actionType);
        return await actionService?.startAction(actionId);
    };

    completeAction = async (
        actionType: string,
        actionId: uuid,
        success?: boolean,
        completionTime?: Date,
        actionDetails?: any): Promise<boolean> => {
        var actionService = this.getActionService(actionType);
        var time = completionTime ?? new Date();
        return await actionService?.completeAction(actionId, time, success, actionDetails);
    };

    updateAction = async (
        actionType: string,
        actionId: uuid,
        updates: any): Promise<any> => {
        var actionService = this.getActionService(actionType);
        return await actionService?.updateAction(actionId, updates);
    };

    cancelAction = async (
        actionType: string,
        actionId: uuid,
        cancellationTime?: Date,
        cancellationReason?: string): Promise<boolean> => {
        var actionService = this.getActionService(actionType);
        return await actionService?.cancelAction(actionId, cancellationTime, cancellationReason);
    };

    getActionService = (actionType: string): IUserActionService => {
        if (actionType === UserActionType.Medication) {
            return Loader.container.resolve(MedicationConsumptionService);
        }
        else if (actionType === UserActionType.Appointment) {
            //return Loader.container.resolve(AppointmentService);
            return null;
        } else if (actionType === UserActionType.Careplan) {
            return Loader.container.resolve(CareplanService);
        } else if (actionType === UserActionType.Custom) {
            return Loader.container.resolve(CustomTaskService);
        }

        return null;
    };

    //#endregion

}
