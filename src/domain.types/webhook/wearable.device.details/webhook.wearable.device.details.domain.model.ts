import { uuid } from "aws-sdk/clients/customerprofiles";

export interface WearableDeviceDetailsDomainModel {
  id?                : uuid;
  PatientUserId?     : uuid;
  Provider?          : string;
  TerraUserId?       : uuid;
  Scopes?            : string;
  AuthenticatedAt?   : Date;
  DeauthenticatedAt? : Date;
}

export interface HealthAppStatus {
  PatientUserId   : uuid;
  TerraUserId     : uuid;
  Provider        : string;
  Status          : string;
  AuthenticatedAt : Date;
}

export enum WearableDeviceNames {
  Cronometer = 'CRONOMETER',
  Fitbit = 'FITBIT',
  Garmin = 'GARMIN',
  Huawei = 'HUAWEI',
  MyFitnessPal = 'MYFITNESSPAL',
  Omron = 'OMRON',
  Polar = 'POLAR',
  TrainingPeaks = 'TRAININGPEAKS',
  UnderArmour = 'UNDERARMOUR',
  Whoop = 'WHOOP',
  Withings = 'WITHINGS',
}
