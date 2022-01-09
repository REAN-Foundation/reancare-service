import { SAssessment, SAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { EnrollmentDomainModel } from "../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { ParticipantDomainModel } from "../../../domain.types/clinical/careplan/participant/participant.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanService {

    init(): Promise<boolean>;

    providerName(): string;

    registerPatient(patientDetails: ParticipantDomainModel): Promise<string>;

    enrollPatientToCarePlan(enrollmentDetails: EnrollmentDomainModel): Promise<string>;

    fetchActivities(
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date): Promise<CareplanActivity[]>;
    
    getActivity(
            patientUserId: uuid,
            careplanCode: string,
            enrollmentId: string,
            activityId: string,
            scheduledAt?:string
        ): Promise<CareplanActivity>;

    updateActivity(
            patientUserId: uuid,
            careplanCode: string,
            enrollmentId: string,
            activityId: string,
            updates: any
        ): Promise<CareplanActivity>;
    
    convertToAssessmentTemplate(assessmentActivity: CareplanActivity): Promise<SAssessmentTemplate>;

    updateAssessment(assessment: SAssessment): boolean | PromiseLike<boolean>;
    
}
