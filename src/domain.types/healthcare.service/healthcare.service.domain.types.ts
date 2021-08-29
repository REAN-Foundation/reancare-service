
///////////////////////////////////////////////////////////////////////////////////////

export interface TimeSlot {
    id?: string;
    StartTime: Date;
    EndTime: Date;
    Location?: string;
}

export interface DaySchedule {
    id?: string;
    Day?: string;
    Date?: string;
    TimeSlots? : TimeSlot[];
    Description?: string;
}

export interface HealthcareServiceSchedule {
    id?: string;

    ProviderUserId?: string;
    ProviderFacilityId?: string;
    ProviderOrganizationId?: string;

    Is24x7Available: boolean;
    IsWeeklySchedule: boolean;

    DaySchedules?: DaySchedule[];
}
