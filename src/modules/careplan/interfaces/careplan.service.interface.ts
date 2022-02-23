import { CAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { EnrollmentDomainModel } from "../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { ParticipantDomainModel } from "../../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ActionPlanDto } from "../../../domain.types/goal.action.plan/goal.action.plan.dto";
import { GoalDto } from "../../../domain.types/patient/goal/goal.dto";

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

    completeActivity(
            patientUserId: uuid,
            careplanCode: string,
            enrollmentId: string,
            activityId: string,
            updates: any
        ): Promise<CareplanActivity>;
    
    convertToAssessmentTemplate(assessmentActivity: CareplanActivity): Promise<CAssessmentTemplate>;

    getGoals(
            patientUserId: uuid,
            enrollmentId: string,
            category: string
        ): Promise<GoalDto[]>;

    getActionPlans(
            patientUserId: uuid,
            enrollmentId: string,
            category: string
        ): Promise<ActionPlanDto[]>;

}
