import { PatientDto } from "../../users/patient/patient/patient.dto";

export interface EmergencyEventDto {
    id?: string,
    EhrId?: string;
    PatientUserId?: PatientDto;
    Details?: string;
    EmergencyDate?: Date;
}
