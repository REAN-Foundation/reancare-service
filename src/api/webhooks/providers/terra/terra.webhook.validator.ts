/* eslint-disable max-len */
import express from 'express';
import { DeAuthDomainModel, ReAuthDomainModel } from '../../../../domain.types/webhook/reauth.domain.model';
import { AuthDomainModel } from '../../../../domain.types/webhook/auth.domain.model';
import { BaseValidator } from '../../../base.validator';
import { Activity, ActivityDomainModel } from '../../../../domain.types/webhook/activity.domain.model';
import { Daily, DailyDomainModel } from '../../../../domain.types/webhook/daily.domain.model';
import { BodyDomainModel, Body } from '../../../../domain.types/webhook/body.domain.model';
import { NutritionDomainModel } from '../../../../domain.types/webhook/nutrition.domain.model';
import { Meal } from '../../../../domain.types/webhook/webhook.event';
import { SleepDomainModel } from '../../../../domain.types/webhook/sleep.domain.model';
import { AthleteDomainModel } from '../../../../domain.types/webhook/athlete.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class TeraWebhookValidator extends BaseValidator {

    constructor() {
        super();
    }

    static auth = async (request ): Promise<AuthDomainModel> => {

        const authDomainModel: AuthDomainModel = {
            Status : request.body.status ?? null,
            User   : {
                UserId            : request.body.user_id,
                Provider          : request.body.provider,
                ReferenceId       : request.body.reference_id,
                Scopes            : request.body.scopes ?? null,
                LastWebhookUpdate : request.body.last_webhook_update ?? null
            }
        };

        return authDomainModel;
    };

    static reAuth = async (request: express.Request): Promise<ReAuthDomainModel> => {

        const version = request.body.version != null ? new Date(Date.parse(request.body.version)) : null;

        const authDomainModel: ReAuthDomainModel = {
            Status  : request.body.status ?? null,
            Type    : request.body.type ?? null,
            OldUser : {
                UserId            : request.body.old_user.user_id,
                Provider          : request.body.old_user.provider,
                ReferenceId       : request.body.old_user.reference_id,
                Scopes            : request.body.old_user.scopes ?? null,
                LastWebhookUpdate : request.body.old_user.last_webhook_update ?? null
            },
            NewUser : {
                UserId            : request.body.new_user.user_id,
                Provider          : request.body.new_user.provider,
                ReferenceId       : request.body.new_user.reference_id,
                Scopes            : request.body.new_user.scopes ?? null,
                LastWebhookUpdate : request.body.new_user.last_webhook_update ?? null
            },
            Message : request.body.message ?? null,
            Version : version ?? null
        };

        return authDomainModel;
    };

    static deAuth = async (request: express.Request): Promise<DeAuthDomainModel> => {

        const version = request.body.version != null ? new Date(Date.parse(request.body.version)) : null;

        const authDomainModel: DeAuthDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Message : request.body.message ?? null,
            Version : version ?? null
        };

        return authDomainModel;
    };

    static activity = async (request): Promise<ActivityDomainModel> => {

        const activitiesData = request.body.data ?? [];
        const activities = [];
        activitiesData.forEach( activity => {
            const activityModel : Activity = {
                MetaData : {
                    Name      : activity.metadata.name,
                    SummaryId : activity.metadata.summary_id,
                    EndTime   : activity.metadata.end_time,
                    Type      : activity.metadata.type,
                    StartTime : activity.metadata.start_time
                },
                DeviceData : {
                    Name                : activity.device_data.name,
                    HardwareVersion     : activity.device_data.hardware_version,
                    Manufacturer        : activity.device_data.manufacturer,
                    SoftwareVersion     : activity.device_data.software_version,
                    ActivationTimestamp : activity.device_data.activation_timestamp,
                    SerialNumber        : activity.device_data.serial_number,
                },
                DistanceData : {
                    Summary : {
                        Swimming : {
                            NumStrokes       : activity.distance_data.summary.swimming.num_strokes,
                            NumLaps          : activity.distance_data.summary.swimming.num_laps,
                            PoolLengthMeters : activity.distance_data.summary.swimming.pool_length_meters,
                        },
                        Steps          : activity.distance_data.summary.steps,
                        DistanceMeters : activity.distance_data.summary.distance_meters,
                    },
                },
                CaloriesData : {
                    NetIntakeCalories   : activity.calories_data.net_intake_calories,
                    BMRCalories         : activity.calories_data.BMR_calories,
                    TotalBurnedCalories : activity.calories_data.total_burned_calories,
                    NetActivityCalories : activity.calories_data.net_activity_calories,
                },
                ActiveDurationsData : {
                    ActivitySeconds : activity.active_durations_data.activity_seconds
                }
            };
            activities.push(activityModel);
        });
        const activityDomainModel: ActivityDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Data : activities
        };

        return await activityDomainModel;
    };

    static daily = async (request): Promise<DailyDomainModel> => {

        const dailyData = request.body.data ?? [];
        const dailyArray = [];
        for (const daily of dailyData) {

            const heartArray = [];
            const heartRateSamples = daily.heart_rate_data.detailed.hr_samples;
            heartRateSamples.forEach( heartRate => {
                const heartRateDomainModel = {
                    BPM       : heartRate.bpm,
                    TimeStamp : heartRate.timestamp
                };
                heartArray.push(heartRateDomainModel);
            });

            const oxygenArray = [];
            const oxygenSamples = daily.oxygen_data.saturation_samples;
            oxygenSamples.forEach( oxygen => {
                const oxygenDomainModel = {
                    Percentage : oxygen.percentage,
                    TimeStamp  : oxygen.timestamp
                };
                oxygenArray.push(oxygenDomainModel);
            });

            const dailyDomainModel : Daily = {
                OxygenData : {
                    SaturationSamples       : oxygenArray,
                    AvgSaturationPercentage : daily.oxygen_data.avg_saturation_percentage,
                    Vo2maxMlPerMinPerKg     : daily.oxygen_data.vo2max_ml_per_min_per_kg
                },
                MetaData : {
                    EndTime    : daily.metadata.end_time,
                    StartTime  : daily.metadata.start_time,
                    UploadType : daily.metadata.upload_type
                },
                DistanceData : {
                    Swimming : {
                        NumStrokes       : daily.distance_data.swimming.num_strokes,
                        NumLaps          : daily.distance_data.swimming.num_laps,
                        PoolLengthMeters : daily.distance_data.swimming.pool_length_meters
                    },
                    FloorsClimbed : daily.distance_data.floors_climbed,
                    Elevation     : {
                        LossActualMeters  : daily.distance_data.elevation.loss_actual_meters,
                        MinMeters         : daily.distance_data.elevation.min_meters,
                        AvgMeters         : daily.distance_data.elevation.avg_meters,
                        GainActualMeters  : daily.distance_data.elevation.gain_actual_meters,
                        MaxMeters         : daily.distance_data.elevation.max_meters,
                        GainPlannedMeters : daily.distance_data.elevation.gain_planned_meters
                    },
                    Steps          : daily.distance_data.steps,
                    DistanceMeters : daily.distance_data.distance_meters,
                },
                METData : {
                    NumLowIntensityMinutes      : daily.MET_data.num_moderate_intensity_minutes,
                    NumLighIntensityMinutes     : daily.MET_data.num_high_intensity_minutes,
                    NumInactiveMinutes          : daily.MET_data.num_inactive_minutes,
                    NumModerateIntensityMinutes : daily.MET_data.num_moderate_intensity_minutes,
                    AvgLevel                    : daily.MET_data.avg_level
                },
                CaloriesData : {
                    NetIntakeCalories   : daily.calories_data.net_intake_calories,
                    BMRCalories         : daily.calories_data.BMR_calories,
                    TotalBurnedCalories : daily.calories_data.total_burned_calories,
                    NetActivityCalories : daily.calories_data.net_activity_calories
                },
                HeartRateData : {
                    Summary : {
                        MaxHrBpm     : daily.heart_rate_data.summary.max_hr_bpm,
                        RestingHrBpm : daily.heart_rate_data.summary.resting_hr_bpm,
                        AvgHrvRmssd  : daily.heart_rate_data.summary.avg_hrv_rmssd,
                        MinHrBpm     : daily.heart_rate_data.summary.min_hr_bpm,
                        UserMaxHrBpm : daily.heart_rate_data.summary.user_max_hr_bpm,
                        AvgHrvSdnn   : daily.heart_rate_data.summary.avg_hrv_sdnn,
                        AvgHrBpm     : daily.heart_rate_data.summary.avg_hr_bpm
                    },
                    Detailed : {
                        HrSamples : heartArray
                    }
                },
                ActiveDurationsData : {
                    ActivitySeconds              : daily.active_durations_data.activity_seconds,
                    RestSeconds                  : daily.active_durations_data.rest_seconds,
                    ActivityLevelsSamples        : daily.active_durations_data.activity_levels_samples,
                    LowIntensitySeconds          : daily.active_durations_data.low_intensity_seconds,
                    VigorousIntensitySeconds     : daily.active_durations_data.vigorous_intensity_seconds,
                    NumContinuousInactivePeriods : daily.active_durations_data.num_continuous_inactive_periods,
                    InactivitySeconds            : daily.active_durations_data.inactivity_seconds,
                    ModerateIntensitySeconds     : daily.active_durations_data.moderate_intensity_seconds
                },
                StressData : {
                    RestStressDurationSeconds     : daily.stress_data.rest_stress_duration_seconds,
                    StressDurationSeconds         : daily.stress_data.stress_duration_seconds,
                    ActivityStressDurationSeconds : daily.stress_data.activity_stress_duration_seconds,
                    AvgStressLevel                : daily.stress_data.avg_stress_level,
                    LowStressDurationSeconds      : daily.stress_data.low_stress_duration_seconds,
                    MediumStressDurationSeconds   : daily.stress_data.medium_stress_duration_seconds,
                    Samples                       : daily.stress_data.samples,
                    HighStressDurationSeconds     : daily.stress_data.high_stress_duration_seconds,
                    MaxStressLevel                : daily.stress_data.max_stress_level
                },
            };
            dailyArray.push(dailyDomainModel);
        }
        const dailyDomainModel: DailyDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Data : dailyArray
        };

        return dailyDomainModel;
    };

    static body = async (request): Promise<BodyDomainModel> => {

        const bodyData = request.body.data ?? [];
        const bodyArray = [];

        for (const body of bodyData) {

            const heartArray = [];
            const heartRateSamples = body.heart_data.heart_rate_data.detailed.hr_samples;
            heartRateSamples.forEach( heartRate => {
                const heartRateDomainModel = {
                    BPM       : heartRate.bpm,
                    TimeStamp : heartRate.timestamp
                };
                heartArray.push(heartRateDomainModel);
            });

            const bpArray = [];
            const bpSamples = body.blood_pressure_data.blood_pressure_samples;
            bpSamples.forEach( bp => {
                const bpDomainModel = {
                    DiastolicBPmmHg : bp.diastolic_bp,
                    SystolicBPmmHg  : bp.systolic_bp,
                    TimeStamp       : bp.timestamp
                };
                bpArray.push(bpDomainModel);
            });

            const oxygenArray = [];
            const oxygenSamples = body.oxygen_data.saturation_samples;
            oxygenSamples.forEach( oxygen => {
                const oxygenDomainModel = {
                    Percentage : oxygen.percentage,
                    TimeStamp  : oxygen.timestamp
                };
                oxygenArray.push(oxygenDomainModel);
            });

            const tempArray = [];
            const tempSamples = body.temperature_data.body_temperature_samples;
            tempSamples.forEach( temp => {
                let tempFahrenheit = 0;
                if ( temp.temperature_celsius < 80) {
                    tempFahrenheit = (temp.temperature_celsius * 1.8) + 32;
                }
                const tempDomainModel = {
                    TemperatureCelsius : tempFahrenheit,
                    TimeStamp          : temp.timestamp
                };
                tempArray.push(tempDomainModel);
            });

            const glucoseArray = [];
            let glucoseSamples = [];
            if (body.glucose_data) {
                glucoseSamples = body.glucose_data.blood_glucose_samples ?? [];
            }
            if (body.insulin_data) {
                glucoseSamples = body.insulin_data.blood_glucose_samples ?? [];
            }
            if (request.body.user.provider === "CRONOMETER") {
                if (body.ketone_data) {
                    glucoseSamples = body.ketone_data.blood_glucose_samples ?? [];
                }
            }
            
            glucoseSamples.forEach( glucose => {
                const glucoseDomainModel = {
                    BloodGlucoseMgPerDL : glucose.blood_glucose_mg_per_dL,
                    TimeStamp           : glucose.timestamp
                };
                glucoseArray.push(glucoseDomainModel);
            });

            const measurementsArray = [];
            const measurementSamples = body.measurements_data.measurements;
            measurementSamples.forEach( measurement => {
                const measurementDomainModel = {
                    HeightCm        : measurement.height_cm,
                    WeightKg        : measurement.weight_kg,
                    MeasurementTime : measurement.measurement_time
                };
                measurementsArray.push(measurementDomainModel);
            });

            let bodyDeviceData = null;
            if (body.device_data) {
                bodyDeviceData = {
                    Name                : body.device_data.name ?? null,
                    HardwareVersion     : body.device_data.hardware_version ?? null,
                    Manufacturer        : body.device_data.manufacturer ?? null,
                    SoftwareVersion     : body.device_data.software_version ?? null,
                    ActivationTimestamp : body.device_data.activation_timestamp ?? null,
                    SerialNumber        : body.device_data.serial_number ?? null,
                };
            }

            const bodyDomainModel : Body = {
                OxygenData : {
                    SaturationSamples : oxygenArray,
                    //AvgSaturationPercentage : body.oxygen_data.avg_saturation_percentage,
                    //Vo2maxMlPerMinPerKg     : body.oxygen_data.vo2max_ml_per_min_per_kg
                },
                MetaData : {
                    EndTime   : body.metadata.end_time,
                    StartTime : body.metadata.start_time
                },
                HydrationData : {
                    DayTotalWaterConsumptionMl : body.hydration_data.day_total_water_consumption_ml
                },
                DeviceData        : bodyDeviceData,
                BloodPressureData : {
                    BloodPressureSamples : bpArray
                },
                TemperatureData : {
                    BodyTemperatureSamples : tempArray
                    //AmbientTemperatureSamples : body.temperature_data.ambient_temperature_samples,
                    //SkinTemperaturSamples     : body.temperature_data.skin_temperature_samples
                },
                MeasurementsData : {
                    Measurements : measurementsArray
                },
                HeartData : {
                    AfibClassificationSamples : body.heart_data.afib_classification_samples,
                    HeartRateData             : {
                        Summary : {
                            MaxHrBpm     : body.heart_data.heart_rate_data.summary.max_hr_bpm,
                            RestingHrBpm : body.heart_data.heart_rate_data.summary.resting_hr_bpm,
                            AvgHrvRmssd  : body.heart_data.heart_rate_data.summary.avg_hrv_rmssd,
                            MinHrBpm     : body.heart_data.heart_rate_data.summary.min_hr_bpm,
                            UserMaxHrBpm : body.heart_data.heart_rate_data.summary.user_max_hr_bpm,
                            AvgHrvSdnn   : body.heart_data.heart_rate_data.summary.avg_hrv_sdnn,
                            AvgHrBpm     : body.heart_data.heart_rate_data.summary.avg_hr_bpm
                        },
                        Detailed : {
                            HrSamples : heartArray
                        }
                    },
                    PulseWaveVelocitySamples : body.heart_data.pulse_wave_velocity_samples
                },
                GlucoseData : {
                    BloodGlucoseSamples : glucoseArray,
                    //DayAvgBloodGlucoseMgPerDL : body.glucose_data.day_avg_blood_glucose_mg_per_dL
                }
            };
            bodyArray.push(bodyDomainModel);
        }
        const bodyDomainModel: BodyDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Data : bodyArray
        };

        return bodyDomainModel;
    };

    static nutrition = async (request): Promise<NutritionDomainModel> => {

        const mealData = request.body.data[0].meals ?? [];
        const meals = [];
        for (const meal of mealData) {
            const mealDomainModel : Meal = {
                Name     : meal.name,
                Id       : meal.id,
                Quantity : {
                    Unit   : meal.quantity.unit,
                    Amount : meal.quantity.amount
                },
                Macros : {
                    Calories       : meal.macros.calories,
                    ProteinG       : meal.macros.protein_g,
                    CarbohydratesG : meal.macros.carbohydrates_g,
                    FatG           : meal.macros.fat_g,
                    SugarG         : meal.macros.sugar_g,
                    CholesterolMg  : meal.macros.cholesterol_mg,
                    FiberG         : meal.macros.fiber_g,
                    SodiumMg       : meal.macros.sodium_mg,
                    AlcoholG       : meal.macros.alcohol_g
                }
            };
            meals.push(mealDomainModel);
        }
        const nutritionDomainModel: NutritionDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            MetaData : {
                StartTime : request.body.data[0].metadata.start_time,
                EndTime   : request.body.data[0].metadata.end_time
            },
            Summary : {
                Macros : {
                    Calories       : request.body.data[0].summary.macros.calories,
                    ProteinG       : request.body.data[0].summary.macros.protein_g,
                    CarbohydratesG : request.body.data[0].summary.macros.carbohydrates_g,
                    FatG           : request.body.data[0].summary.macros.fat_g,
                    SugarG         : request.body.data[0].summary.macros.sugar_g,
                    CholesterolMg  : request.body.data[0].summary.macros.cholesterol_mg,
                    FiberG         : request.body.data[0].summary.macros.fiber_g,
                    SodiumMg       : request.body.data[0].summary.macros.sodium_mg,
                    AlcoholG       : request.body.data[0].summary.macros.alcohol_g
                },
                WaterMl : request.body.data[0].summary.water_ml ? parseInt(request.body.data[0].summary.water_ml) : 0
            },
            Meals : meals
        };

        return nutritionDomainModel;
    };

    static sleep = async (request): Promise<SleepDomainModel> => {

        const version = request.body.version != null ? new Date(Date.parse(request.body.version)) : null;
        const sleepDomainModel: SleepDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Data : {
                SleepDurationsData : {
                    Other : {
                        DurationInBedSeconds             : request.body.data[0].sleep_durations_data.other.duration_in_bed_seconds,
                        DurationUnmeasurableSleepSeconds : request.body.data[0].sleep_durations_data.other.duration_unmeasurable_sleep_seconds
                    },
                    SleepEfficiency : request.body.data[0].sleep_durations_data.sleep_efficiency,
                    Awake           : {
                        DurationShortInterruptionSeconds : request.body.data[0].sleep_durations_data.awake.duration_short_interruption_seconds,
                        DurationAwakeStateSeconds        : request.body.data[0].sleep_durations_data.awake.duration_awake_state_seconds,
                        DurationLongInterruptionSeconds  : request.body.data[0].sleep_durations_data.awake.duration_long_interruption_seconds,
                        NumWakeupEvents                  : request.body.data[0].sleep_durations_data.awake.num_wakeup_events,
                        WakeUpLatencySeconds             : request.body.data[0].sleep_durations_data.awake.wake_up_latency_seconds,
                        NumOutOfBedEvents                : request.body.data[0].sleep_durations_data.awake.num_out_of_bed_events,
                        SleepLatencySeconds              : request.body.data[0].sleep_durations_data.awake.sleep_latency_seconds },
                    Asleep : {
                        DurationLightSleepStateSeconds : request.body.data[0].sleep_durations_data.asleep.duration_light_sleep_state_seconds,
                        DurationAsleepStateSeconds     : request.body.data[0].sleep_durations_data.asleep.duration_asleep_state_seconds ?? null,
                        NumREMEvents                   : request.body.data[0].sleep_durations_data.asleep.num_REM_events,
                        DurationREMSleepStateSeconds   : request.body.data[0].sleep_durations_data.asleep.duration_REM_sleep_state_seconds,
                        DurationDeepSleepStateSeconds  : request.body.data[0].sleep_durations_data.asleep.duration_deep_sleep_state_seconds
                    }
                },
                MetaData : {
                    StartTime  : request.body.data[0].metadata.start_time,
                    EndTime    : request.body.data[0].metadata.end_time,
                    UploadType : request.body.data[0].metadata.upload_type,
                    IsNap      : request.body.data[0].metadata.is_nap
                }
            },
            Version : version
        };

        if (!sleepDomainModel.Data.SleepDurationsData.Asleep.DurationAsleepStateSeconds) {
            sleepDomainModel.Data.SleepDurationsData.Asleep.DurationAsleepStateSeconds = sleepDomainModel.Data.SleepDurationsData.Other.DurationInBedSeconds;
        }
        return sleepDomainModel;
    };

    static athlete = async (request: express.Request): Promise<AthleteDomainModel> => {

        const version = request.body.version != null ? new Date(Date.parse(request.body.version)) : null;

        const athleteDomainModel: AthleteDomainModel = {
            Status : request.body.status ?? null,
            Type   : request.body.type ?? null,
            User   : {
                UserId            : request.body.user.user_id,
                Provider          : request.body.user.provider,
                ReferenceId       : request.body.user.reference_id,
                Scopes            : request.body.user.scopes ?? null,
                LastWebhookUpdate : request.body.user.last_webhook_update ?? null
            },
            Data : {
                Age         : request.body.data[0].age,
                Country     : request.body.data[0].country,
                Bio         : request.body.data[0].bio,
                State       : request.body.data[0].state,
                LastName    : request.body.data[0].last_name,
                Sex         : request.body.data[0].sex,
                City        : request.body.data[0].city,
                Email       : request.body.data[0].email,
                DateOfBirth : request.body.data[0].date_of_birth,
                FirstName   : request.body.data[0].first_name,
                Gender      : request.body.data[0].gender,
            },
            Version : version
        };

        return athleteDomainModel;
    };

    // create = async (request: express.Request): Promise<PatientDomainModel> => {
    //     await this.validateBody(request, true);
    //     return this.getCreateDomainModel(request);
    // };

    // private async validateBody(request: express.Request, create = true): Promise<void> {

    //     await this.validateString(request, 'Phone', Where.Body, create, false);
    //     await this.validateEmail(request, 'Email', Where.Body, false, true);
    //     await this.validateString(request, 'TelegramChatId', Where.Body, false, true);
    //     await this.validateString(request, 'Prefix', Where.Body, false, true);
    //     await this.validateString(request, 'FirstName', Where.Body, false, true);
    //     await this.validateString(request, 'LastName', Where.Body, false, true);
    //     await this.validateString(request, 'Gender', Where.Body, false, true);
    //     await this.validateString(request, 'SelfIdentifiedGender', Where.Body, false, true);
    //     await this.validateString(request, 'MaritalStatus', Where.Body, false, true);
    //     await this.validateString(request, 'Race', Where.Body, false, true);
    //     await this.validateString(request, 'Ethnicity', Where.Body, false, true);
    //     await this.validateDate(request, 'BirthDate', Where.Body, false, true);
    //     await this.validateString(request, 'Age', Where.Body, false, true);
    //     await this.validateString(request, 'StrokeSurvivorOrCaregiver', Where.Body, false, true);
    //     await this.validateBoolean(request, 'LivingAlone', Where.Body, false, true);
    //     await this.validateBoolean(request, 'WorkedPriorToStroke', Where.Body, false, true);
    //     await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
    //     await this.validateString(request, 'DonorAcceptance', Where.Body, false, false);

    //     await body('AddressIds').optional()
    //         .isArray()
    //         .toArray()
    //         .run(request);

    //     await body('Addresses').optional()
    //         .isArray()
    //         .run(request);

    //     this.validateRequest(request);
    // }

}
