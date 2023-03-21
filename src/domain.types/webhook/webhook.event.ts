import { uuid } from "../miscellaneous/system.types";

export type EventStatus = 'success' | 'error' | 'warning';

export type dataType = 'activity' | 'body' | 'daily' | 'nutrition' | 'sleep' | 'menstruation';

type Some<T> = T;
type None = null;
export type Option<T> = Some<T> | None;

export enum NutritionUnits {
  GRAM = 1,
  TEASPOON = 2,
  TABLESPOON = 3,
  CUP = 4,
  MEDIUM_EGG = 5,
  LARGE_EGG = 6,
  SMALL_EGG = 7,
  MILLILITER = 8,
  OUNCE = 9,
  COUNT = 10,
  UNKNOWN = 0,
}

export type EventType =
  | 'athlete'
  | 'activity'
  | 'body'
  | 'daily'
  | 'sleep'
  | 'nutrition'
  | 'menstruation'
  | 'auth'
  | 'user_reauth'
  | 'connection_error'
  | 'request_processing'
  | 'google_no_datasource'
  | 'request_completed'
  | 'access_revoked'
  | 'deauth'
  | 'internal_server_error'
  | 'unknown';

export interface TerraPayload {
  status: EventStatus;
  type: EventType;
  user?: TerraUser;
  message?: string;
  data?: Array<dataType>;
  retry_after_seconds?: number;
  widget_session_id?: string;
  reference_id?: string;
  reason?: string;
  
}

export interface TerraUser {
    UserId             : string;
    Provider            : string;
    ReferenceId        : uuid;
    Scopes?             : string;
    LastWebhookUpdate : string;
}

export interface Meal {
  Name: string;
  Id: string;
  Quantity: {
    Unit: string;
    Amount: Option<number>;
  };
  Macros: {
    Calories: Option<number>;
    ProteinG: Option<number>;
    CarbohydratesG: Option<number>;
    FatG: Option<number>;
    SugarG: Option<number>;
    CholesterolMg: Option<number>;
    FiberG: Option<number>;
    SodiumMg: Option<number>;
    AlcoholG: Option<number>;
  };
  Micros?: {
    SeleniumMg: Option<number>;
    NiacinMg: Option<number>;
    MagnesiumMg: Option<number>;
    CopperMg: Option<number>;
    VitaminB12Mg: Option<number>;
    VitaminB6Mg: Option<number>;
    VitaminCMg: Option<number>;
    ZincMg: Option<number>;
    VitaminEMg: Option<number>;
    ManganeseMg: Option<number>;
    VitaminDMg: Option<number>;
    IodineMg: Option<number>;
    ChlorideMg: Option<number>;
    Folate_mg: Option<number>;
    CalciumMg: Option<number>;
    MolybdenumMg: Option<number>;
    VitaminAMg: Option<number>;
    RiboflavinMg: Option<number>;
    FolicAcidMg: Option<number>;
    IronMg: Option<number>;
    ThiaminMg: Option<number>;
    PantothenicAcidMg: Option<number>;
    CaffeineMg: Option<number>;
    VitaminKMg: Option<number>;
    ChromiumMg: Option<number>;
    PotassiumMg: Option<number>;
    BiotinMg: Option<number>;
    PhosphorusMg: Option<number>;
  };
}
