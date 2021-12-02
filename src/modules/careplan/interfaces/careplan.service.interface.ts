
import { PatientDomainModel } from "../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanDto } from "../domain.types/careplan.dto";
import { CarePlanTaskDto } from "../domain.types/careplan.task.dto";

export interface ICarePlanService {

    init(): Promise<boolean>;

    registerPatient(patientDomainModel: PatientDomainModel): Promise<any>;
    registerPatientToCarePlan(patientUserId: string): Promise<CarePlanDto>;
    fetchTasksForDay(patientUserId: string, day: Date): Promise<CarePlanTaskDto[]>;
    fetchTasks(id: string, startDay: Date, endDay: Date): Promise<any>;
}
