import { UserActionType } from "../../domain.types/user/user.task/user.task..types";
import { Loader } from "../../startup/loader";
import { MedicationConsumptionService } from "../clinical/medication/medication.consumption.service";
import { CareplanService } from "../careplan/careplan.service";
import { IUserActionService } from "./user.action.service.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UserActionResolver {

    //#region Methods to be called from UserTaskService

    completeAction = async (
        actionType: string,
        actionId: string,
        success?: boolean,
        completionTime?: Date): Promise<boolean> => {
        var actionService = this.getActionService(actionType);
        var time = completionTime ?? new Date();
        return await actionService?.completeAction(actionId, time, success);
    }

    cancelAction = async (
        actionType: string,
        actionId: string,
        cancellationTime?: Date,
        cancellationReason?: string): Promise<boolean> => {
        var actionService = this.getActionService(actionType);
        return await actionService?.cancelAction(actionId, cancellationTime, cancellationReason);
    }

    getActionService = (actionType: string): IUserActionService => {
        if (actionType === UserActionType.Medication) {
            return Loader.container.resolve(MedicationConsumptionService);
        }
        else if (actionType === UserActionType.Appointment) {
            //return Loader.container.resolve(AppointmentService);
            return null;
        } else if (actionType === UserActionType.Careplan) {
            return Loader.container.resolve(CareplanService);
        }
        return null;
    }

    //#endregion

}
