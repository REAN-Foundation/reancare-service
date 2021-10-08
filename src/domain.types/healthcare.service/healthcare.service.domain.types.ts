
///////////////////////////////////////////////////////////////////////////////////////

export interface TimeSlot {
    StartTime: string;
    EndTime: string;
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
