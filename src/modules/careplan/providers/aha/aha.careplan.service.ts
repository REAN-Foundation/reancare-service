import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { PatientDomainModel } from "../../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanDto } from "../../domain.types/careplan.dto";
import { CarePlanTaskDto } from "../../domain.types/careplan.task.dto";
import { ICarePlanService } from "../../interfaces/careplan.service.interface";

//////////////////////////////////////////////////////////////////////////////////////////////////

export class AhaCarePlanService implements ICarePlanService {

    init(): Promise<boolean> {
        //Implement the initialization of AHa careplan API
        throw new Error("Method not implemented.");
    }

    registerPatient(patientDomainModel: PatientDomainModel): Promise<any> {
        throw new Error("Method not implemented.");
    }

    registerPatientToCarePlan(patientUserId: uuid): Promise<CarePlanDto> {
        throw new Error("Method not implemented.");
    }

    fetchTasksForDay(patientUserId: uuid, day: Date): Promise<CarePlanTaskDto[]> {
        throw new Error("Method not implemented.");
    }

    fetchTasks(id: string, startDate: Date, endDate: Date): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}
