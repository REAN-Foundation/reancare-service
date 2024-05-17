import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface EmergencyEventDto {
    id?: string,
    EhrId?: string;
    PatientUserId?: uuid;
    Details?: string;
    EmergencyDate?: Date;
}
