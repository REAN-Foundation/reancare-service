import { injectable } from "tsyringe";
import { ICarePlanService } from "../interfaces/careplan.service.interface";
// import { AhaCarePlanService } from "../providers/aha/aha.careplan.service";
import { PatientDomainModel } from "../../../domain.types/patient/patient/patient.domain.model";
import { CarePlanTaskDto } from "../domain.types/careplan.task.dto";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "../domain.types/enrollment/enrollment.domain.model";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { Loader } from "../../../startup/loader";
import Dictionary from "../../../common/dictionary";

////////////////////////////////////////////////////////////////////////

@injectable()
export class CarePlanService {

    _services = new Dictionary<ICarePlanService>();
    
    registerProviders() {
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            var service = Loader.container.resolve(cp.Service) as ICarePlanService;
            this._services.add(cp.Provider, service);
        }
    }
    
    init = async (): Promise<boolean> => {

        for await (var s of this._services.getKeys()) {
            var service = this._services.getItem(s);
            await service.init();
        }
        return true;
    };

    enrollPatientToCarePlan = async (
        patient: PatientDomainModel,
        enrollmentDetails: EnrollmentDomainModel): Promise<any> => {
        const provider = enrollmentDetails.Provider;
        var service = this._services.getItem(provider);
        return await service.enrollPatientToCarePlan(patient, enrollmentDetails);
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
