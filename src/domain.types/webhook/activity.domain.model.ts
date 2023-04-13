import { EventStatus, EventType, TerraUser } from "./webhook.event";

export interface ActivityDomainModel {
  Status : EventStatus;
  Type   : EventType;
  User   : TerraUser;
  Data   : Activity[];
}

export interface Activity {
  MetaData: {
    Name: string;
    SummaryId: string;
    Country?:string;
    State?: string;
    EndTime: string;
    City?: string;
    Type?: string;
    StartTime: string;
  };
  DeviceData?: {
    Name: string;
    HardwareVersion: string;
    Manufacturer: string;
    SoftwareVersion: string;
    ActivationTimestamp: string;
    SerialNumber: string;
  };
  DistanceData: {
    Summary: {
      Swimming?: {
        NumStrokes: number;
        NumLaps: number;
        PoolLengthMeters: number;
      };
      Steps: number;
      DistanceMeters?: number;
    };
  };
  CaloriesData: {
    NetIntakeCalories?: number;
    BMRCalories?: number;
    TotalBurnedCalories?: number;
    NetActivityCalories: number;
  };
  HeartRateData?: {
    Summary: {
      MaxHrBpm: number;
      RestingHrBpm: number;
      AvgHrvRmssd: number;
      MinHrBpm: number;
      UserMaxHrBpm: number;
      AvgHrvSdnn: number;
      AvgHrBpm: number;
    };
  };
  ActiveDurationsData: {
    ActivitySeconds: number;
    RestSeconds?: number;
    LowIntensitySeconds?: number;
    VigorousIntensitySeconds?: number;
    NumContinuousInactivePeriods?: number;
    InactivitySeconds?: number;
    ModerateIntensitySeconds?: number;
  };
}

export enum ActivityType {
  IN_VEHICLE = 0,
  BIKING = 1,
  STILL = 3,
  UNKNOWN = 4,
  TILTING = 5,
  WALKING = 7,
  RUNNING = 8,
  AEROBICS = 9,
  BADMINTON = 10,
  BASEBALL = 11,
  BASKETBALL = 12,
  BIATHLON = 13,
  HANDBIKING = 14,
  MOUNTAIN_BIKING = 15,
  ROAD_BIKING = 16,
  SPINNING = 17,
  STATIONARY_BIKING = 18,
  UTILITY_BIKING = 19,
  BOXING = 20,
  CALISTHENICS = 21,
  CIRCUIT_TRAINING = 22,
  CRICKET = 23,
  DANCING = 24,
  ELLIPTICAL = 25,
  FENCING = 26,
  AMERICAN_FOOTBALL = 27,
  AUSTRALIAN_FOOTBALL = 28,
  ENGLISH_FOOTBALL = 29,
  FRISBEE = 30,
  GARDENING = 31,
  GOLF = 32,
  GYMNASTICS = 33,
  HANDBALL = 34,
  HIKING = 35,
  HOCKEY = 36,
  HORSEBACK_RIDING = 37,
  HOUSEWORK = 38,
  JUMPING_ROPE = 39,
  KAYAKING = 40,
  KETTLEBELL_TRAINING = 41,
  KICKBOXING = 42,
  KITESURFING = 43,
  MARTIAL_ARTS = 44,
  MEDITATION = 45,
  MIXED_MARTIAL_ARTS = 46,
  P90X_EXERCISES = 47,
  PARAGLIDING = 48,
  PILATES = 49,
  POLO = 50,
  RACQUETBALL = 51,
  ROCK_CLIMBING = 52,
  ROWING = 53,
  ROWING_MACHINE = 54,
  RUGBY = 55,
  JOGGING = 56,
  RUNNING_ON_SAND = 57,
  TREADMILL_RUNNING = 58,
  SAILING = 59,
  SCUBA_DIVING = 60,
  SKATEBOARDING = 61,
  SKATING = 62,
  CROSS_SKATING = 63,
  INDOOR_ROLLERBLADING = 64,
  SKIING = 65,
  BACK_COUNTRY_SKIING = 66,
  CROSS_COUNTRY_SKIING = 67,
  DOWNHILL_SKIING = 68,
  KITE_SKIING = 69,
  ROLLER_SKIING = 70,
  SLEDDING = 71,
  SNOWBOARDING = 73,
  SNOWMOBILE = 74,
  SNOWSHOEING = 75,
  SQUASH = 76,
  STAIR_CLIMBING = 77,
  STAIR_CLIMBING_MACHINE = 78,
  STAND_UP_PADDLEBOARDING = 79,
  STRENGTH_TRAINING = 80,
  SURFING = 81,
  SWIMMING = 82,
  SWIMMING_SWIMMING_POOL = 83,
  SWIMMING_OPEN_WATER = 84,
  TABLE_TENNIS = 85,
  TEAM_SPORTS = 86,
  TENNIS = 87,
  TREADMILL = 88,
  VOLLEYBALL = 89,
  VOLLEYBALL_BEACH = 90,
  VOLLEYBALL_INDOOR = 91,
  WAKEBOARDING = 92,
  WALKING_FITNESS = 93,
  NORDIC_WALKING = 94,
  WALKING_TREADMILL = 95,
  WATERPOLO = 96,
  WEIGHTLIFTING = 97,
  WHEELCHAIR = 98,
  WINDSURFING = 99,
  YOGA = 100,
  ZUMBA = 101,
  DIVING = 102,
  ERGOMETER = 103,
  ICE_SKATING = 104,
  INDOOR_SKATING = 105,
  CURLING = 106,
  OTHER = 108,
  CROSSFIT = 113,
  HIIT = 114,
  INTERVAL_TRAINING = 115,
  WALKING_STROLLER = 116,
  ELEVATOR = 117,
  ESCALATOR = 118,
  ARCHERY = 119,
  SOFTBALL = 120,
  GUIDED_BREATHING = 122,
}
