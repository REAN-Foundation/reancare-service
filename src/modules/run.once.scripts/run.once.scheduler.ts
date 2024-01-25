import * as cron from 'node-cron';
import { injectable } from 'tsyringe';
import { Logger } from '../../common/logger';
import { CareplanService } from '../../services/clinical/careplan.service';
import { PatientService } from '../../services/users/patient/patient.service';
import { Injector } from '../../startup/injector';
import { EHRCareplanActivityService } from '../ehr.analytics/ehr.services/ehr.careplan.activity.service';
import { EHRAssessmentService } from '../../modules/ehr.analytics/ehr.services/ehr.assessment.service';
import { EHRVitalService } from '../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { EHRLabService } from '../../modules/ehr.analytics/ehr.services/ehr.lab.service';
import { EHRMentalWellBeingService } from '../../modules/ehr.analytics/ehr.services/ehr.mental.wellbeing.service';
import { EHRPhysicalActivityService } from '../../modules/ehr.analytics/ehr.services/ehr.physical.activity.service';
import { EHRNutritionService } from '../../modules/ehr.analytics/ehr.services/ehr.nutrition.service';
import { EHRMedicationService } from '../../modules/ehr.analytics/ehr.services/ehr.medication.service';
import { LabRecordService } from '../../services/clinical/lab.record/lab.record.service';
import { HowDoYouFeelService } from '../../services/clinical/symptom/how.do.you.feel.service';
import { DailyAssessmentService } from '../../services/clinical/daily.assessment/daily.assessment.service';
import { BloodGlucoseService } from '../../services/clinical/biometrics/blood.glucose.service';
import { BloodOxygenSaturationService } from '../../services/clinical/biometrics/blood.oxygen.saturation.service';
import { BloodPressureService } from '../../services/clinical/biometrics/blood.pressure.service';
import { BodyHeightService } from '../../services/clinical/biometrics/body.height.service';
import { BodyTemperatureService } from '../../services/clinical/biometrics/body.temperature.service';
import { BodyWeightService } from '../../services/clinical/biometrics/body.weight.service';
import { PulseService } from '../../services/clinical/biometrics/pulse.service';
import { AssessmentService } from '../../services/clinical/assessment/assessment.service';
import { AssessmentTemplateService } from '../../services/clinical/assessment/assessment.template.service';
import { MedicationConsumptionService } from '../../services/clinical/medication/medication.consumption.service';
import { SleepService } from '../../services/wellness/daily.records/sleep.service';
import { MeditationService } from '../../services/wellness/exercise/meditation.service';
import { StandService } from '../../services/wellness/daily.records/stand.service';
import { StepCountService } from '../../services/wellness/daily.records/step.count.service';
import { PhysicalActivityService } from '../../services/wellness/exercise/physical.activity.service';
import { FoodConsumptionService } from '../../services/wellness/nutrition/food.consumption.service';
import { PatientAppNameCache } from '../ehr.analytics/patient.appname.cache';
import { EmergencyContactService } from '../../services/users/patient/emergency.contact.service';
import { EHRPatientService } from '../ehr.analytics/ehr.services/ehr.patient.service';
import { EHRHowDoYouFeelService } from '../ehr.analytics/ehr.services/ehr.how.do.you.feel.service';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RunOnceScheduler {
    //#region member variables and constructors

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _careplanService: CareplanService = Injector.Container.resolve(CareplanService);

    _labRecordService: LabRecordService = Injector.Container.resolve(LabRecordService);

    _ehrCareplanActivityService: EHRCareplanActivityService = Injector.Container.resolve(EHRCareplanActivityService);

    _howDoYouFeelService: HowDoYouFeelService = Injector.Container.resolve(HowDoYouFeelService);

    _dailyAssessmentService: DailyAssessmentService = Injector.Container.resolve(DailyAssessmentService);

    _bloodGlucoseService: BloodGlucoseService = Injector.Container.resolve(BloodGlucoseService);

    _bloodPressureService: BloodPressureService = Injector.Container.resolve(BloodPressureService);

    _pulseService: PulseService = Injector.Container.resolve(PulseService);

    _bodyWeightService: BodyWeightService = Injector.Container.resolve(BodyWeightService);

    _bodyHeightService: BodyHeightService = Injector.Container.resolve(BodyHeightService);

    _bodyTemperatureService: BodyTemperatureService = Injector.Container.resolve(BodyTemperatureService);

    _bloodOxygenSaturationService: BloodOxygenSaturationService = Injector.Container.resolve(BloodOxygenSaturationService);

    _assessmentService: AssessmentService = Injector.Container.resolve(AssessmentService);

    _assessmentTemplateService: AssessmentTemplateService = Injector.Container.resolve(AssessmentTemplateService);

    _medicationConsumptionService: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    _sleepService: SleepService = Injector.Container.resolve(SleepService);

    _meditationService: MeditationService = Injector.Container.resolve(MeditationService);

    _foodConsumptionService: FoodConsumptionService = Injector.Container.resolve(FoodConsumptionService);

    _standService: StandService = Injector.Container.resolve(StandService);

    _stepCountService: StepCountService = Injector.Container.resolve(StepCountService);

    _physicalActivityService: PhysicalActivityService = Injector.Container.resolve(PhysicalActivityService);

    _emergencyContactService: EmergencyContactService = Injector.Container.resolve(EmergencyContactService);

    _ehrVitalService: EHRVitalService = Injector.Container.resolve(EHRVitalService);

    _ehrLabService: EHRLabService = Injector.Container.resolve(EHRLabService);

    _ehrMentalWellBeingService: EHRMentalWellBeingService = Injector.Container.resolve(EHRMentalWellBeingService);

    _ehrPhysicalActivityService: EHRPhysicalActivityService = Injector.Container.resolve(EHRPhysicalActivityService);

    _ehrNutritionService: EHRNutritionService = Injector.Container.resolve(EHRNutritionService);

    _ehrMedicationService: EHRMedicationService = Injector.Container.resolve(EHRMedicationService);

    _ehrAssessmentService: EHRAssessmentService = Injector.Container.resolve(EHRAssessmentService);

    _ehrHowDoYouFeelService: EHRHowDoYouFeelService = Injector.Container.resolve(EHRHowDoYouFeelService);

    _ehrPatientService: EHRPatientService = Injector.Container.resolve(EHRPatientService);

    //#endregion

    static _instance: RunOnceScheduler = null;

    public static instance(): RunOnceScheduler {
        return this._instance || (this._instance = Injector.Container.resolve(RunOnceScheduler));
    }
    public schedule(schedules: any) {
        this.scheduleExistingVitalDataToEHR(schedules);
        this.scheduleExistingLabDataToEHR(schedules);
        this.scheduleExistingPhysicalActivityDataToEHR(schedules);
        this.scheduleExistingMentalWellBeingDataToEHR(schedules);
        this.scheduleExistingNutritionDataToEHR(schedules);
        this.scheduleExistingMedicationDataToEHR(schedules);
        this.scheduleExistingSymptomDataToEHR(schedules);
        this.scheduleExistingCareplanActivityDataToEHR(schedules);
        this.scheduleExistingAssessmentDataToEHR(schedules);
        this.scheduleExistingStaticDataToEHR(schedules);
    }

    private scheduleExistingVitalDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingVitalDataToEHR'], () => {
            (async () => {
                Logger.instance().log(
                    '[ScheduleExistingVitalDataToEHR]: Running scheduled jobs: Schedule to populate existing vitals data in EHR database...'
                );
                await this.addExistingVitalDataToEHR();
                Logger.instance().log('[ScheduleExistingVitalDataToEHR] : Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingLabDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingLabDataToEHR'], () => {
            (async () => {
                Logger.instance().log(
                    '[ScheduleExistingLabDataToEHR]: Running scheduled jobs: Schedule to populate existing labs data in EHR database...'
                );
                await this.addExistingLabDataToEHR();
                Logger.instance().log('[ScheduleExistingLabDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingPhysicalActivityDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingPhysicalActivityDataToEHR'], () => {
            (async () => {
                Logger.instance().log(
                    '[ScheduleExistingPhysicalActivityDataToEHR]: Running scheduled jobs: Schedule to populate existing physical activities data in EHR database...'
                );
                await this.addExistingPhysicalActivityDataToEHR('PhysicalActivity');
                await this.addExistingPhysicalActivityDataToEHR('Stand');
                await this.addExistingPhysicalActivityDataToEHR('StepCount');
                Logger.instance().log('[ScheduleExistingPhysicalActivityDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingMentalWellBeingDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingMentalWellBeingDataToEHR'], () => {
            (async () => {
                Logger.instance().log(
                    '[ScheduleExistingMentalWellBeingDataToEHR]: Running scheduled jobs...'
                );
                await this.addExistingMentalWellBeingDataToEHR('Meditation');
                await this.addExistingMentalWellBeingDataToEHR('Sleep');
                Logger.instance().log('[ScheduleExistingMentalWellBeingDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingNutritionDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingNutritionDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingNutritionDataToEHR]: Running scheduled jobs...');
                await this.addExistingNutritionDataToEHR();
                Logger.instance().log('[ScheduleExistingNutritionDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingMedicationDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingMedicationDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingMedicationDataToEHR]: Running scheduled jobs...');
                await this.addExistingMedicationDataToEHR();
                Logger.instance().log('[ScheduleExistingMedicationDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingSymptomDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingSymptomDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingSymptomDataToEHR]: Running scheduled jobs...');
                await this.addExistingSymptomDataToEHR();
                Logger.instance().log('[ScheduleExistingSymptomDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingAssessmentDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingAssessmentDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingAssessmentDataToEHR]: Running scheduled jobs...');
                await this.addExistingAssessmentDataToEHR();
                Logger.instance().log('[ScheduleExistingAssessmentDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingCareplanActivityDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingCareplanActivityDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingCareplanActivityDataToEHR]: Running scheduled jobs...');
                await this.addExistingCareplanActivityDataToEHR();
                Logger.instance().log('[ScheduleExistingCareplanActivityDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    private scheduleExistingStaticDataToEHR = (schedules) => {
        cron.schedule(schedules['ScheduleExistingStaticDataToEHR'], () => {
            (async () => {
                Logger.instance().log('[ScheduleExistingStaticDataToEHR]: Running scheduled jobs...');
                await this.addExistingStaticDataToEHR();
                Logger.instance().log('[ScheduleExistingStaticDataToEHR]: Cron schedule completed successfully');
            })();
        });
    };

    public addExistingLabDataToEHR = async () => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex   : pageIndex,
                    ItemsPerPage: 1000,
                };

                var searchResults = null;

                searchResults = await this._labRecordService.search(filters);
                for await (var r of searchResults.Items) {
                    await this._ehrLabService.addEHRLabRecordForAppNames(r);
                }

                pageIndex++;
                Logger.instance().log(
                    `[ScheduleExistingLabDataToEHR] Processed :${searchResults.Items.length} records for lab`
                );

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(
                `[ScheduleExistingLabDataToEHR] Error population existing data in ehr insights database: ${JSON.stringify(
                    error
                )}`
            );
        }
    };

    public addExistingAssessmentDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            for await (var patientId of patientUserIds) {
                var eligibleAppNames = await PatientAppNameCache.get(patientId);
                if (eligibleAppNames.length === 0) {
                    continue;
                }
                var moreItems = true;
                var pageIndex = 0;
                while (moreItems) {
                    var filters = {
                        PageIndex     : pageIndex,
                        ItemsPerPage  : 1000,
                        PatientUserId : patientId,
                    };
                    var searchResults = await this._assessmentService.search(filters);
                    for await (var assessment_ of searchResults.Items) {
                        var assessment = await this._assessmentService.getById(assessment_.id);
                        for await (var appName of eligibleAppNames) {
                            this._ehrAssessmentService.addEHRRecord(assessment, appName);
                        }
                    }
                    pageIndex++;
                    if (searchResults.Items.length < 1000) {
                        moreItems = false;
                    }
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingAssessmentDataToEHR]: ${JSON.stringify(error)}`);
        }
    };

    public addExistingStaticDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();

            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Patient User Ids: ${JSON.stringify(patientUserIds)}`);

            for await (var pid of patientUserIds) {
                var patientDetails = await this._patientService.getByUserId(pid);
                if (patientDetails == null) {
                    continue;
                }
                var emergencyDetails = await this._emergencyContactService.search({ PatientUserId: pid });
                var i = 1;
                for (var e of emergencyDetails.Items) {
                    if (e.ContactRelation === 'Doctor') {
                        patientDetails[`DoctorPersonId_${i}`] = e.ContactPersonId;
                        i++;
                    }
                }
                await this._ehrPatientService.addEHRRecordPatientForAppNames(patientDetails);
            }
            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Processed ${patientDetails.UserId} for static data`);
        } catch (error) {
            Logger.instance().log(
                `[ScheduleExistingStaticDataToEHR] Error population existing static data in ehr insights database: ${JSON.stringify(
                    error
                )}`
            );
        }
    };

    public addExistingCareplanActivityDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            for await (var p of patientUserIds) {
                var patientDetails = await this._patientService.getByUserId(p);
                var startTime = new Date('2020-01-01');
                var endTime = new Date('2024-12-01');
                var careplanActivities = await this._careplanService.getActivities(p, startTime, endTime);
                await this._ehrCareplanActivityService.addCareplanActivitiesToEHR(careplanActivities, patientDetails);
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingCareplanActivityDataToEHR] ehr insights: ${JSON.stringify(error)}`);
        }
    };

    public addExistingMedicationDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();

            for await (var p of patientUserIds) {
                var moreItems = true;
                var pageIndex = 0;
                while (moreItems) {
                    var filters = {
                        PageIndex     : pageIndex,
                        ItemsPerPage  : 1000,
                        PatientUserId : p,
                        DateTo        : new Date(),
                    };
                    var searchResults = await this._medicationConsumptionService.search(filters);
                    for await (var r of searchResults.Items) {
                        await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(r);
                    }
                    pageIndex++;
                    if (searchResults.Items.length < 1000) {
                        moreItems = false;
                    }
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingMedicationDataToEHR]: ${JSON.stringify(error)}`);
        }
    };

    public addExistingMentalWellBeingDataToEHR = async (model: string) => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (model) {
                    case 'Sleep':
                        searchResults = await this._sleepService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrMentalWellBeingService.addEHRSleepForAppNames(r);
                        }
                        break;

                    case 'Meditation':
                        searchResults = await this._meditationService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrMentalWellBeingService.addEHRMeditationForAppNames(r);
                        }
                        break;
                }
                pageIndex++;

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(
                `[ScheduleExistingMentalWellBeingDataToEHR] Error population existing data in ehr insights database: ${JSON.stringify(
                    error
                )}`
            );
        }
    };

    public addExistingNutritionDataToEHR = async () => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex   : pageIndex,
                    ItemsPerPage: 1000,
                };

                var searchResults = null;

                searchResults = await this._foodConsumptionService.search(filters);
                for await (var r of searchResults.Items) {
                    await this._ehrNutritionService.addEHRRecordNutritionForAppNames(r);
                }

                pageIndex++;

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingNutritionDataToEHR]: ${JSON.stringify(error)}`);
        }
    };

    public addExistingPhysicalActivityDataToEHR = async (model: string) => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (model) {
                    case 'Stand':
                        searchResults = await this._standService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrPhysicalActivityService.addEHRRecordStandForAppNames(r);
                        }
                        break;

                    case 'StepCount':
                        searchResults = await this._stepCountService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrPhysicalActivityService.addEHRRecordStepCountForAppNames(r);
                        }
                        break;

                    case 'PhysicalActivity':
                        searchResults = await this._physicalActivityService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(r);
                        }
                        break;
                }
                pageIndex++;

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR]: ${JSON.stringify(error)}`);
        }
    };

    public addExistingSymptomDataToEHR = async () => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                searchResults = await this._howDoYouFeelService.search(filters);
                for await (var r of searchResults.Items) {
                    await this._ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(r);
                }

                pageIndex++;
                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }

            moreItems = true;
            pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var dailyAssessmentSearchResults = null;
                dailyAssessmentSearchResults = await this._dailyAssessmentService.search(filters);

                for await (var dr of dailyAssessmentSearchResults.Items) {
                    await this._ehrHowDoYouFeelService.addEHRDailyAssessmentForAppNames(dr);
                }

                pageIndex++;
                if (dailyAssessmentSearchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingSymptomDataToEHR]: ${JSON.stringify(error)}`);
        }
    };

    public addExistingVitalDataToEHR = async () => {
        await this.addExistingVitalData('BloodPressure');
        await this.addExistingVitalData('BloodGlucose');
        await this.addExistingVitalData('BodyWeight');
        await this.addExistingVitalData('BodyHeight');
        await this.addExistingVitalData('BodyTemperature');
        await this.addExistingVitalData('BloodOxygenSaturation');
        await this.addExistingVitalData('Pulse');
    };

    public addExistingVitalData = async (dataType: string) => {
        try {
            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (dataType) {
                    case 'BloodGlucose':
                        searchResults = await this._bloodGlucoseService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBloodGlucoseForAppNames(r);
                        }
                        break;

                    case 'BloodPressure':
                        searchResults = await this._bloodPressureService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBloodPressureForAppNames(r);
                        }
                        break;

                    case 'Pulse':
                        searchResults = await this._pulseService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRPulseForAppNames(r);
                        }
                        break;

                    case 'BodyWeight':
                        searchResults = await this._bodyWeightService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBodyWeightForAppNames(r);
                        }
                        break;

                    case 'BodyHeight':
                        searchResults = await this._bodyHeightService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBodyHeightForAppNames(r);
                        }
                        break;

                    case 'BodyTemperature':
                        searchResults = await this._bodyTemperatureService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBodyTemperatureForAppNames(r);
                        }
                        break;

                    case 'BloodOxygenSaturation':
                        searchResults = await this._bloodOxygenSaturationService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this._ehrVitalService.addEHRBloodOxygenSaturationForAppNames(r);
                        }
                        break;
                }
                pageIndex++;
                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }
            }
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingVitalDataToEHR] : ${JSON.stringify(error)}`);
        }
    };
}
