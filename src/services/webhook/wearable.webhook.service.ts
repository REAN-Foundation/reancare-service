/* eslint-disable max-len */
import { inject, injectable } from "tsyringe";
import { ConfigurationManager } from "../../config/configuration.manager";
import { BodyWeightStore } from "../../modules/ehr/services/body.weight.store";
import { Loader } from "../../startup/loader";
import { IPulseRepo } from "../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { IBodyTemperatureRepo } from "../..//database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { IBloodPressureRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBloodOxygenSaturationRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { IBloodGlucoseRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { AuthDomainModel } from "../../domain.types/webhook/auth.domain.model";
import { DeAuthDomainModel, ReAuthDomainModel } from "../../domain.types/webhook/reauth.domain.model";
import { NutritionDomainModel } from "../../domain.types/webhook/nutrition.domain.model";
import { FoodConsumptionEvents } from "../../domain.types/wellness/nutrition/food.consumption/food.consumption.types";
import { IFoodConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { FoodConsumptionDomainModel } from "../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model";
import { ICalorieBalanceRepo } from "../../database/repository.interfaces/wellness/daily.records/calorie.balance.repo.interface";
import { ApiError } from "../../common/api.error";
import { IWaterConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface";
import { BodyDomainModel } from "../../domain.types/webhook/body.domain.model";
import { IStepCountRepo } from "../../database/repository.interfaces/wellness/daily.records/step.count.interface";
import { DailyDomainModel } from "../../domain.types/webhook/daily.domain.model";
import { IBodyWeightRepo } from "../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { IBodyHeightRepo } from "../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";
import { Logger } from "../../common/logger";
import { IWearableDeviceDetailsRepo } from "../..//database/repository.interfaces/webhook/webhook.wearable.device.details.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TeraWebhookService {

    _ehrBodyWeightStore: BodyWeightStore = null;

    constructor(
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('ICalorieBalanceRepo') private _calorieBalanceRepo: ICalorieBalanceRepo,
        @inject('IWaterConsumptionRepo') private _waterConsumptionRepo: IWaterConsumptionRepo,
        @inject('IStepCountRepo') private _stepCountRepo: IStepCountRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
        @inject('IWearableDeviceDetailsRepo') private _webhookWearableDeviceDetailsRepo: IWearableDeviceDetailsRepo
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBodyWeightStore = Loader.container.resolve(BodyWeightStore);
        }
    }
  
    auth = async (authDomainModel: AuthDomainModel) => {

        if (authDomainModel.User.ReferenceId) {
            const entity = {
                PatientUserId     : authDomainModel.User.ReferenceId,
                Provider          : authDomainModel.User.Provider,
                TerraUserId       : authDomainModel.User.UserId,
                Scopes            : authDomainModel.User.Scopes,
                AuthenticatedAt   : new Date(),
                DeauthenticatedAt : null
            };
            await this._webhookWearableDeviceDetailsRepo.create(entity);
        } else {
            Logger.instance().log(`Reference id is null for ${authDomainModel.User.UserId} terra user id`);
        }
    };

    reAuth = async (reAuthDomainModel: ReAuthDomainModel) => {
        if (reAuthDomainModel.NewUser.ReferenceId) {
            const currentUser = await this._webhookWearableDeviceDetailsRepo.getWearableDeviceDetails(
                reAuthDomainModel.OldUser.UserId, reAuthDomainModel.OldUser.Provider );
            const entityToUpdate = {
                PatientUserId     : reAuthDomainModel.NewUser.ReferenceId,
                Provider          : reAuthDomainModel.NewUser.Provider,
                TerraUserId       : reAuthDomainModel.NewUser.UserId,
                Scopes            : reAuthDomainModel.NewUser.Scopes,
                AuthenticatedAt   : new Date(),
                DeauthenticatedAt : null
            };
            await this._webhookWearableDeviceDetailsRepo.update(currentUser.id, entityToUpdate);
        } else {
            Logger.instance().log(`Reference id is null for ${reAuthDomainModel.NewUser.UserId} terra user id`);
        }
    };

    deAuth = async (deAuthDomainModel: DeAuthDomainModel) => {
        if (deAuthDomainModel) {
            const currentUser = await this._webhookWearableDeviceDetailsRepo.getWearableDeviceDetails(
                deAuthDomainModel.User.UserId, deAuthDomainModel.User.Provider );
            const entityToUpdate = {
                DeauthenticatedAt : new Date()
            };
            await this._webhookWearableDeviceDetailsRepo.update(currentUser.id, entityToUpdate);
            await this._webhookWearableDeviceDetailsRepo.delete(currentUser.id);
        } else {
            Logger.instance().log(`Reference id is null for ${deAuthDomainModel.User.UserId} terra user id`);
        }
    };

    nutrition = async (nutritionDomainModel: NutritionDomainModel) => {

        const meals = nutritionDomainModel.Meals;
        meals.forEach(async meal => {
            const mealDomainModel : FoodConsumptionDomainModel = {
                PatientUserId : nutritionDomainModel.User.ReferenceId,
                Provider      : nutritionDomainModel.User.Provider,
                Food          : meal.Name,
                Servings      : meal.Quantity.Amount,
                ServingUnit   : meal.Quantity.Unit,
                ConsumedAs    : FoodConsumptionEvents.Other,
                Calories      : meal.Macros.Calories,
                StartTime     : new Date(nutritionDomainModel.MetaData.StartTime),
                EndTime       : new Date(nutritionDomainModel.MetaData.EndTime)
            };
            await this._foodConsumptionRepo.create(mealDomainModel);
        });

        // Adding calorie summary data in daily records
        const recordDate = nutritionDomainModel.MetaData.StartTime.split('T')[0];
        var existingRecord =
            await this._calorieBalanceRepo.getByRecordDate(new Date(recordDate), nutritionDomainModel.User.ReferenceId);
        if (existingRecord !== null) {
            const domainModel = {
                Provider         : nutritionDomainModel.User.Provider,
                CaloriesConsumed : existingRecord.CaloriesConsumed + nutritionDomainModel.Summary.Macros.Calories
            };
            var caloriesConsumed = await this._calorieBalanceRepo.update(existingRecord.id, domainModel);
        } else {
            const domainModel = {
                PatientUserId    : nutritionDomainModel.User.ReferenceId,
                Provider         : nutritionDomainModel.User.Provider,
                CaloriesConsumed : nutritionDomainModel.Summary.Macros.Calories,
                RecordDate       : new Date(nutritionDomainModel.MetaData.StartTime.split('T')[0])
            };
            var caloriesConsumed = await this._calorieBalanceRepo.create(domainModel);
        }
        if (caloriesConsumed == null) {
            throw new ApiError(400, 'Cannot create calorie consumption!');
        }

        // Adding water summary data in daily records
        const waterDate = nutritionDomainModel.MetaData.StartTime.split('T')[0];
        var existingRecordWater =
            await this._waterConsumptionRepo.getByRecordDate(new Date(waterDate), nutritionDomainModel.User.ReferenceId);
        if (existingRecordWater !== null) {
            const waterDomainModel = {
                Provider : nutritionDomainModel.User.Provider,
                Volume   : existingRecordWater.Volume + nutritionDomainModel.Summary.WaterMl
            };
            var waterConsumed = await this._waterConsumptionRepo.update(existingRecordWater.id, waterDomainModel);
        } else {
            const waterDomainModel = {
                PatientUserId : nutritionDomainModel.User.ReferenceId,
                Provider      : nutritionDomainModel.User.Provider,
                Volume        : nutritionDomainModel.Summary.WaterMl,
                Time          : new Date(nutritionDomainModel.MetaData.StartTime.split('T')[0])
            };
            var waterConsumed = await this._waterConsumptionRepo.create(waterDomainModel);
        }
        if (waterConsumed == null) {
            throw new ApiError(400, 'Cannot create water consumption!');
        }
    };

    body = async (bodyDomainModel: BodyDomainModel) => {
        const bodyData = bodyDomainModel.Data;
        bodyData.forEach(async body => {
           
            const bloodPressureSamples = body.BloodPressureData.BloodPressureSamples;
            Logger.instance().log(`Incoming BP samples ${JSON.stringify(bloodPressureSamples, null, 2)}`);
            const recentBP = await this._bloodPressureRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredBPSamples = [];
            if (recentBP != null) {
                filteredBPSamples = bloodPressureSamples.filter((bp) => new Date(bp.TimeStamp) > recentBP.RecordDate);
            } else {
                filteredBPSamples = bloodPressureSamples;
            }
            Logger.instance().log(`Filterred BP samples ${JSON.stringify(filteredBPSamples, null, 2)}`);
            filteredBPSamples.forEach(async bp => {
                const bpDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    Systolic      : bp.SystolicBPmmHg,
                    Diastolic     : bp.DiastolicBPmmHg,
                    Unit          : "mmHg",
                    RecordDate    : new Date(bp.TimeStamp)
                };
                await this._bloodPressureRepo.create(bpDomainModel);

            });

            const bloodGlucoseSamples = body.GlucoseData.BloodGlucoseSamples;
            Logger.instance().log(`Incoming glucose samples ${JSON.stringify(bloodGlucoseSamples, null, 2)}`);
            const recentGlucose = await this._bloodGlucoseRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredGlucoseSamples = [];
            if (recentGlucose != null) {
                filteredGlucoseSamples = bloodGlucoseSamples.filter((bloodGluocse) =>
                    new Date(bloodGluocse.TimeStamp) > recentGlucose.RecordDate);
            } else {
                filteredGlucoseSamples = bloodGlucoseSamples;
            }
            Logger.instance().log(`Filterred glucose samples ${JSON.stringify(filteredGlucoseSamples, null, 2)}`);
            filteredGlucoseSamples.forEach(async bloodGluocse => {
                const bloodGlucoseDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    BloodGlucose  : bloodGluocse.BloodGlucoseMgPerDL,
                    Unit          : "mg/dL",
                    RecordDate    : new Date(bloodGluocse.TimeStamp)
                };
                await this._bloodGlucoseRepo.create(bloodGlucoseDomainModel);

            });

            let oxygenSamples = body.OxygenData.SaturationSamples;
            oxygenSamples = oxygenSamples.sort((a, b) => {
                return  new Date(b.TimeStamp).getTime() - new Date(a.TimeStamp).getTime();
            });
            Logger.instance().log(`Incoming oxygen samples ${JSON.stringify(oxygenSamples, null, 2)}`);
            const recentOxygen = await this._bloodOxygenSaturationRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredOxygenSamples = [];
            if (recentOxygen != null) {
                const allowedDuration_in_sec = parseInt(process.env.MIN_PULSE_RECORDS_SAMPLING_DURATION_INSEC);
                const oxygenSample =  oxygenSamples[0];
                const oldTimeStamp: any = new Date(recentOxygen.RecordDate).getTime();
                const newTimeStamp: any = new Date(oxygenSample.TimeStamp).getTime();
                const timeDiffrence = (newTimeStamp - oldTimeStamp) / 1000;
                if (timeDiffrence > allowedDuration_in_sec) {
                    filteredOxygenSamples.push(oxygenSample);
                }
            } else {
                filteredOxygenSamples = oxygenSamples;
            }
            Logger.instance().log(`Filterred oxygen samples ${JSON.stringify(filteredOxygenSamples, null, 2)}`);
            filteredOxygenSamples.forEach(async bloodOxygen => {
                const bloodOxygenDomainModel = {
                    PatientUserId         : bodyDomainModel.User.ReferenceId,
                    Provider              : bodyDomainModel.User.Provider,
                    BloodOxygenSaturation : bloodOxygen.Percentage,
                    Unit                  : "%",
                    RecordDate            : new Date(bloodOxygen.TimeStamp)
                };
                await this._bloodOxygenSaturationRepo.create(bloodOxygenDomainModel);
            });

            var heartRateSamples = body.HeartData.HeartRateData.Detailed.HrSamples;
            heartRateSamples = heartRateSamples.sort((a, b) => {
                return  new Date(b.TimeStamp).getTime() - new Date(a.TimeStamp).getTime();
            });
            Logger.instance().log(`Incoming pulse samples ${JSON.stringify(heartRateSamples, null, 2)}`);
            const recentPulse = await this._pulseRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredPulseSamples = [];
            if (recentPulse != null) {
                const allowedDuration_in_sec = parseInt(process.env.MIN_PULSE_RECORDS_SAMPLING_DURATION_INSEC);
                const pulseSample =  heartRateSamples[0];
                const oldTimeStamp: any = new Date(recentPulse.RecordDate).getTime();
                const newTimeStamp: any = new Date(pulseSample.TimeStamp).getTime();
                const timeDiffrence = (newTimeStamp - oldTimeStamp) / 1000;
                if (timeDiffrence > allowedDuration_in_sec) {
                    filteredPulseSamples.push(pulseSample);
                }
            } else {
                filteredPulseSamples = [heartRateSamples[0]];
            }
            Logger.instance().log(`Filterred pulse samples ${JSON.stringify(filteredPulseSamples, null, 2)}`);
            filteredPulseSamples.forEach(async heartRate => {
                const heartRateDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    Pulse         : heartRate.BPM,
                    Unit          : "bpm",
                    RecordDate    : new Date(heartRate.TimeStamp)
                };
                await this._pulseRepo.create(heartRateDomainModel);
            });

            const tempSamples = body.TemperatureData.BodyTemperatureSamples;
            Logger.instance().log(`Incoming Temp samples ${JSON.stringify(tempSamples, null, 2)}`);
            const recentTemp = await this._bodyTemperatureRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredTempSamples = [];
            if (recentTemp != null) {
                filteredTempSamples = tempSamples.filter((temp) => new Date(temp.TimeStamp) > recentTemp.RecordDate);
            } else {
                filteredTempSamples = tempSamples;
            }
            Logger.instance().log(`Filterred Temp samples ${JSON.stringify(filteredTempSamples, null, 2)}`);
            filteredTempSamples.forEach(async bodyTemp => {
                const bodyTempDomainModel = {
                    PatientUserId   : bodyDomainModel.User.ReferenceId,
                    Provider        : bodyDomainModel.User.Provider,
                    BodyTemperature : bodyTemp.TemperatureCelsius,
                    Unit            : "°C",
                    RecordDate      : new Date(bodyTemp.TimeStamp)
                };
                await this._bodyTemperatureRepo.create(bodyTempDomainModel);

            });

            const measurementSamples = body.MeasurementsData.Measurements;
            const recentHeight = await this._bodyHeightRepo.getRecent(bodyDomainModel.User.ReferenceId);
            const recentWeight = await this._bodyWeightRepo.getRecent(bodyDomainModel.User.ReferenceId);
            let filteredMeasurementSamples = [];
            if (recentWeight != null) {
                filteredMeasurementSamples = measurementSamples.filter((weight) =>
                    new Date(weight.MeasurementTime) > recentWeight.RecordDate);
            } else {
                filteredMeasurementSamples = measurementSamples;
            }
            filteredMeasurementSamples.forEach(async measurement => {
                if (measurement.HeightCm) {
                    if (recentHeight != null) {
                        if (new Date(measurement.MeasurementTime) > recentHeight.RecordDate) {
                            const bodyHeightDomainModel = {
                                PatientUserId : bodyDomainModel.User.ReferenceId,
                                BodyHeight    : measurement.HeightCm,
                                Unit          : "cm",
                                RecordDate    : new Date(measurement.MeasurementTime)
                            };
                            await this._bodyHeightRepo.create(bodyHeightDomainModel);
                        }
                    }
                }

                if (measurement.WeightKg) {
                    const bodyWeightDomainModel = {
                        PatientUserId : bodyDomainModel.User.ReferenceId,
                        BodyWeight    : measurement.WeightKg,
                        Unit          : "Kg",
                        RecordDate    : new Date(measurement.MeasurementTime)
                    };
                    await this._bodyWeightRepo.create(bodyWeightDomainModel);
                }
            });
        });
    };

    daily = async (dailyDomainModel: DailyDomainModel) => {

        const dailyData = dailyDomainModel.Data;
        dailyData.forEach(async daily => {

            // Adding calorie summary data in daily records
            const recordDate = daily.MetaData.StartTime.split('T')[0];
            var existingRecord =
            await this._calorieBalanceRepo.getByRecordDate(new Date(recordDate), dailyDomainModel.User.ReferenceId);
            if (existingRecord !== null) {
                const domainModel = {
                    Provider       : dailyDomainModel.User.Provider,
                    CaloriesBurned : existingRecord.CaloriesBurned + daily.CaloriesData.NetActivityCalories
                };
                var caloriesBurned = await this._calorieBalanceRepo.update(existingRecord.id, domainModel);
            } else {
                const domainModel = {
                    PatientUserId  : dailyDomainModel.User.ReferenceId,
                    Provider       : dailyDomainModel.User.Provider,
                    CaloriesBurned : daily.CaloriesData.NetActivityCalories,
                    RecordDate     : new Date(daily.MetaData.StartTime.split('T')[0])
                };
                var caloriesBurned = await this._calorieBalanceRepo.create(domainModel);
            }
            if (caloriesBurned == null) {
                throw new ApiError(400, 'Cannot create Calories Burned!');
            }

            // Adding step count data in daily records
            var existingStepRecord = await this._stepCountRepo.getByRecordDateAndPatientUserId(new Date(recordDate),
                dailyDomainModel.User.ReferenceId, dailyDomainModel.User.Provider);
            if (existingStepRecord !== null) {
                const domainModel = {
                    Provider   : dailyDomainModel.User.Provider,
                    StepCount  : daily.DistanceData.Steps,
                    RecordDate : null
                };
                var stepCount = await this._stepCountRepo.update(existingStepRecord.id, domainModel);
            } else {
                const domainModel = {
                    PatientUserId : dailyDomainModel.User.ReferenceId,
                    Provider      : dailyDomainModel.User.Provider,
                    StepCount     : daily.DistanceData.Steps,
                    RecordDate    : new Date(recordDate.split('T')[0]),
                    Unit          : "steps"
                };
                var stepCount = await this._stepCountRepo.create(domainModel);
            }
            if (stepCount == null) {
                throw new ApiError(400, 'Cannot create step count!');
            }
        });
    };
    
}
