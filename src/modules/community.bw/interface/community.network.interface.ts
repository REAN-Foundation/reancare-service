import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";

export interface IBloodWarriorService {

    providerName(): string;

    fetchActivities(
        careplanCode: string,
        enrollmentId: string,
        participantId?: string,
        fromDate?: Date,
        toDate?: Date): Promise<CareplanActivity[]>;

}
