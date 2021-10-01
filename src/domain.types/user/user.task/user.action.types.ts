export enum UserActionStatusTypes {
    Created    = 'Created',
    Pending    = 'Pending',
    InProgress = 'In-progress',
    Completed  = 'Completed',
    Cancelled  = 'Cancelled',
    Unknown    = 'Unknown'
}

export const UserActionStatusTypesList: UserActionStatusTypes [] = [
    UserActionStatusTypes.Created,
    UserActionStatusTypes.Pending,
    UserActionStatusTypes.InProgress,
    UserActionStatusTypes.Completed,
    UserActionStatusTypes.Cancelled,
    UserActionStatusTypes.Unknown,
];
