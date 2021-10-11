
export interface IUserActionService {

    completeAction(actionId: string, completionTime?: Date, success?: boolean): Promise<boolean>;

    cancelAction(actionId: string, cancellationTime?: Date, cancellationReason?: string): Promise<boolean>;

}
