import { Gender, uuid } from "../../../domain.types/miscellaneous/system.types";
import { DataTypes, EHRRecordTypes } from "./ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////

export interface EHRDynamicRecordDomainModel {
    AppName?      : string;
    PatientUserId?: uuid;
    RecordId?     : uuid;
    Provider?     : string;
    Type          : EHRRecordTypes;
    Name          : string;
    ValueInt?     : number;
    ValueFloat?   : number;
    ValueString?  : string;
    ValueBoolean? : boolean;
    ValueDate?    : Date;
    ValueDataType?: DataTypes;
    ValueName?    : string;
    ValueUnit?    : string;
    TimeStamp?    : Date;
    RecordDate?   : Date;
}

export interface EHRStaticRecordDomainModel {
    AppName?             : string;
    DoctorPersonId_1?    : uuid;
    DoctorPersonId_2?    : uuid;
    OtherDoctorPersonId? : uuid;
    ProviderCode?        : string;
    HealthSystem?        : string;
    AssociatedHospital?  : string;
    Gender?              : Gender;
    SelfIdentifiedGender?: string;
    BirthDate?           : Date;
    Age?                 : string;
    BodyHeight?          : number;
    Ethnicity?           : string;
    Race?                : string;
    Nationality?         : string;
    HasHeartAilment?     : boolean;
    HasHighBloodPressure?: boolean;
    HasHighCholesterol?  : boolean;
    Occupation?          : string;
    IsDiabetic?          : boolean;
    MaritalStatus?       : string;
    BloodGroup?          : string;
    MajorAilment?        : string;
    IsSmoker?            : boolean;
    Location?            : string;
    OtherConditions?     : string;
    RecordDate?          : Date;

}

export interface EHRVitalsDomainModel {
    AppNames?              : string;
    PatientUserId?         : uuid;
    RecordId?              : uuid;
    Provider?              : string;
    VitalType              : string;
    BloodGlucose?          : number;
    BloodPressureSystolic? : number;
    BloodPressureDiastolic?: number;
    BloodOxygenSaturation? : number;
    BodyWeight?            : number;
    BodyTemperature?       : number;
    Pulse?                 : number;
    BodyHeight?            : number;
    Unit?                  : string;
    TimeStamp?             : Date;
    RecordDate?            : Date;
}

export interface EHRMentalWellbeingDomainModel {
    AppNames?              : string;
    PatientUserId?         : uuid;
    RecordId?              : uuid;
    Provider?              : string;
    Type                   : string;
    SleepMins?             : number;
    MeditationMins?        : number;
    Unit?                  : string;
    TimeStamp?             : Date;
    RecordDate?            : Date;
}

export interface EHRPhysicalActivityDomainModel {
    AppNames?                    : string;
    PatientUserId?               : uuid;
    RecordId?                    : uuid;
    Provider?                    : string;
    Type                         : string;
    StepCounts?                  : number;
    StandMins?                   : number;
    ExerciseMins?                : number;
    PhysicalActivityQuestion?    : string;
    PhysicalActivityUserResponse?: boolean;
    Unit?                        : string;
    TimeStamp?                   : Date;
    RecordDate?                  : Date;
}

export interface EHRSymptomsDomainModel {
    AppNames?                   : string;
    PatientUserId?              : uuid;
    RecordId?                   : uuid;
    Provider?                   : string;
    Type                        : string;
    Mood?                       : string;
    Feeling?                    : string;
    EnergyLevels?               : string;
    SymptomQuestion?            : string;
    SymptomQuestionUserResponse?: string;
    Unit?                       : string;
    TimeStamp?                  : Date;
    RecordDate?                 : Date;
}

export interface EHRLabsDomainModel {
    AppNames?          : string;
    PatientUserId?     : uuid;
    RecordId?          : uuid;
    Provider?          : string;
    Type               : string;
    TotalCholesterol?  : number;
    HDL?               : number;
    LDL?               : number;
    Lipoprotein?       : number;
    A1CLevel?          : number;
    TriglycerideLevel? : number;
    CholesterolRatio?  : number;
    Unit?              : string;
    TimeStamp?         : Date;
    RecordDate?        : Date;
}

export interface EHRNutritionsDomainModel {
    AppNames?                     : string;
    PatientUserId?                : uuid;
    RecordId?                     : uuid;
    Provider?                     : string;
    Type                          : string;
    NutritionQuestion?            : string;
    NutritionQuestionUserResponse?: boolean;
    FruitCups?                    : number;
    SugaryDrinkServings?          : number;
    VegetableCups?                : number;
    TakenSalt?                    : boolean;
    SeaFoodServings?              : number;
    GrainServings?                : number;
    TakenProteins?                : boolean;
    ServingUnit?                  : string;
    TimeStamp?                    : Date;
    RecordDate?                   : Date;
}

