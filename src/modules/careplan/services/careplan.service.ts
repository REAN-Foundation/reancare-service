import { ICarePlanService } from "../interfaces/careplan.service.interface";
import { AhaCarePlanService } from "../providers/aha/aha.careplan.service";

////////////////////////////////////////////////////////////////////////

export class CarePlanService {

    _services: ICarePlanService[] = [];

    constructor() {
        this._services.push(new AhaCarePlanService());
        //add any other care plan service ...
        //
    }

    init = async (): Promise<boolean> => {
        //Initialize all provider specific services
        for await (var service of this._services) {
            return await service.init();
        }
    };

}
