export interface TaskDto {
    id?: string;
    PatientUserId: string;
    DisplayId?: string;
    Name?: string;
    CategoryId: number;
    Type: string;
    SubType?: string;
    ReferenceItemId?: string;
    ScheduledStartTime?: Date;
    ScheduledEndTime?: Date;
    Started: boolean;
    StartedAt?: Date;
    Finished: boolean;
    FinishedAt?: Date;
    TaskIsSuccess: boolean;
    Cancelled: boolean;
}
