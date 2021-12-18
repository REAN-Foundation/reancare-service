import { inject, injectable } from "tsyringe";
import { IPersonRepo } from "../../../database/repository.interfaces/person.repo.interface";
import { ICarePlanService } from "../interfaces/careplan.service.interface";
import { AhaCarePlanService } from "../providers/aha/aha.careplan.service";
import { PatientDomainModel } from "../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanTaskDto } from "../domain.types/careplan.task.dto";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "../domain.types/enrollment/enrollment.domain.model";

////////////////////////////////////////////////////////////////////////

@injectable()
export class CarePlanService {

    _services: ICarePlanService[] = [];

    constructor(
        @inject('IPersonRepo') private personRepo: IPersonRepo
    ) {
        this._services.push(new AhaCarePlanService(personRepo));
        //add any other care plan service ...
        //
    }
    
    init = async (): Promise<boolean> => {
        //Initialize all provider specific services
        for await (var service of this._services) {
            return await service.init();
        }
    };

    registerPatient = async (patientDomainModel: PatientDomainModel): Promise<any> => {
        return await this._services[0].registerPatient(patientDomainModel);
    }

    registerPatientToCarePlan = async (
        patientDomainModel: PatientDomainModel, enrollmentDomainModel: EnrollmentDomainModel): Promise<any> => {
        return await this._services[0].registerPatientToCarePlan(patientDomainModel, enrollmentDomainModel);
    }

    fetchTasksForDay = async (patientUserId: uuid, day: Date): Promise<CarePlanTaskDto[]> => {
        return await this._services[0].fetchTasksForDay(patientUserId, day);
    }

    fetchTasks = async (id: string, startDate: Date, endDate: Date): Promise<any> => {
        return await this._services[0].fetchTasks(id, startDate, endDate);
    }

    delete = async (id: string): Promise<any> => {
        return await this._services[0].delete(id);
    }

}
