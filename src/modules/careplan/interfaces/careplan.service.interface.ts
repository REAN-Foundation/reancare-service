
import { PatientDomainModel } from "../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanTaskDto } from "../domain.types/careplan.task.dto";
import { EnrollmentDomainModel } from "../domain.types/enrollment/enrollment.domain.model";

export interface ICarePlanService {

    init(): Promise<boolean>;

    registerPatient(patientDomainModel: PatientDomainModel): Promise<any>;
    registerPatientToCarePlan
    (patientDomainModel: PatientDomainModel, enrollmentDomainModel: EnrollmentDomainModel): Promise<any>;
    fetchTasksForDay(patientUserId: string, day: Date): Promise<CarePlanTaskDto[]>;
    fetchTasks(id: string, startDay: Date, endDay: Date): Promise<any>;
    delete(id: string): Promise<any>;
}
