import { uuid } from "../../miscellaneous/system.types";
import { FoodComponentMonitoringTypes } from "./food.component.monitoring.types";

export interface FoodComponentMonitoringDomainModel {
    id?                   : uuid,
    EhrId?                : string;
    PatientUserId         : uuid;
    MonitoredFoodComponent: FoodComponentMonitoringTypes;
    Amount                : number;
    Unit                  : string;
}
