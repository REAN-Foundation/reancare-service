import express from "express";
import { Logger } from "../../common/logger";
import { register as registerAddressRoutes } from "./address.routes";
import { register as registerClientRoutes } from "./api.client.routes";
import { register as registerAllergyRoutes } from './clinical/allergy.routes';
import { register as registerBloodGlucoseRoutes } from './clinical/biometrics/blood.glucose.routes';
import { register as registerBiometricsBloodOxygenSaturationRoutes } from './clinical/biometrics/blood.oxygen.saturation.routes';
import { register as registerBloodPressureRoutes } from './clinical/biometrics/blood.pressure.routes';
import { register as registerBodyHeightRoutes } from './clinical/biometrics/body.height.routes';
import { register as registerBodyTemperatureRoutes } from './clinical/biometrics/body.temperature.routes';
import { register as registerBodyWeightRoutes } from './clinical/biometrics/body.weight.routes';
import { register as registerBiometricsPulse } from './clinical/biometrics/pulse.routes';
import { register as registerComplaintRoutes } from './clinical/complaint.routes';
import { register as registerDailyAssessmentRoutes } from './clinical/daily.assessment/daily.assessment.routes';
import { register as registerDiagnosisRoutes } from './clinical/diagnosis.routes';
import { register as registerDoctorNoteRoutes } from './clinical/doctor.note.routes';
import { register as registerEmergencyEventRoutes } from './clinical/emergency.event.routes';
import { register as registerMedicalConditionRoutes } from './clinical/medical.condition.routes';
import { register as registerDrugRoutes } from './clinical/medication/drug.routes';
import { register as registerMedicationConsumptionRoutes } from './clinical/medication/medication.consumption.routes';
import { register as registerMedicationRoutes } from './clinical/medication/medication.routes';
import { register as registerOrderRoutes } from './clinical/order.routes';
import { register as registerHowDoYouFeelRoutes } from './clinical/symptom/how.do.you.feel.routes';
import { register as registerSymptomAssessmentRoutes } from './clinical/symptom/symptom.assessment.routes';
import { register as registerSymptomAssessmentTemplateRoutes } from './clinical/symptom/symptom.assessment.template.routes';
import { register as registerSymptomRoutes } from './clinical/symptom/symptom.routes';
import { register as registerSymptomTypeRoutes } from './clinical/symptom/symptom.type.routes';
import { register as registerDoctorRoutes } from "./doctor.routes";
import { register as registerKnowledgeNuggetRoutes } from './educational/knowledge.nugget.routes';
import { register as registerFileResourceRoutes } from './file.resource.routes';
import { register as registerOrganizationRoutes } from './organization.routes';
import { register as registerPatientDocumentRoutes, registerSharingRoutes as registerDocumentSharingRoutes } from './patient/document.routes';
import { register as registerEmergencyContactRoutes } from './patient/emergency.contact.routes';
import { register as registerGoalRoutes } from './patient/goal.routes';
import { register as registerPatientHealthProfileRoutes } from './patient/health.profile.routes';
import { register as registerPatientRoutes } from "./patient/patient.routes";
import { register as registerPersonRoutes } from './person.routes';
import { register as registerTypesRoutes } from './types.routes';
import { register as registerUserDeviceDetailsRoutes } from './user/user.device.details.routes';
import { register as registerUserRoutes } from "./user/user.routes";
import { register as registerUserTaskRoutes } from './user/user.task.routes';
import { register as registerCalorieBalanceRoute } from './wellness/daily.records/calorie.balance.routes';
import { register as registerHeartPointRoutes } from './wellness/daily.records/heart.points.routes';
import { register as registerMoveMinutesRoutes } from './wellness/daily.records/move.minutes.routes';
import { register as registerSleepRoutes } from './wellness/daily.records/sleep.routes';
import { register as registerStepCountRoutes } from './wellness/daily.records/step.count.routes';
import { register as registerMeditationtRoutes } from './wellness/exercise/meditation.routes';
import { register as registerPhysicalActivityRoutes } from './wellness/exercise/physical.activity.routes';
import { register as registerNutritionFoodConsumptionRoutes } from './wellness/nutrition/food.consumption.routes';
import { register as registerWaterConsumptionRoutes } from './wellness/nutrition/water.consumption.routes';
import { register as registerCareplanRoutes } from './clinical/careplan/careplan.routes';
import { register as registerAssessmentRoutes } from './clinical/assessment/assessment.routes';
import { register as registerAssessmentTemplateRoutes } from './clinical/assessment/assessment.template.routes';
import { register as registerHealthPriorityRoutes } from './patient/health.priority/health.priority.routes';
import { register as registerActionPlanRoutes } from './action.plan/action.plan.routes';
import { register as registerFormsRoutes } from './clinical/assessment/forms.routes';
import { register as registerCustomTaskRoutes } from './user/custom.task.routes';
import { register as registerBloodCholesterolRoutes } from './clinical/biometrics/blood.cholesterol.routes';
import { register as registerStandRoutes } from './wellness/daily.records/stand.routes';
import { register as registerFoodComponentMonitoringRoutes } from './wellness/food.component.monitoring/food.component.monitoring.routes';

////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `REANCare API [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerUserRoutes(this._app);
                registerAddressRoutes(this._app);
                registerClientRoutes(this._app);
                registerPatientRoutes(this._app);
                registerDoctorRoutes(this._app);
                registerTypesRoutes(this._app);
                registerBodyWeightRoutes(this._app);
                registerBiometricsBloodOxygenSaturationRoutes(this._app);
                registerPersonRoutes(this._app);
                registerOrganizationRoutes(this._app);
                registerBloodPressureRoutes(this._app);
                registerBodyHeightRoutes(this._app);
                registerPatientHealthProfileRoutes(this._app);
                registerPatientHealthProfileRoutes(this._app);
                registerNutritionFoodConsumptionRoutes(this._app);
                registerStepCountRoutes(this._app);
                registerBiometricsPulse(this._app);
                registerBodyTemperatureRoutes(this._app);
                registerMoveMinutesRoutes(this._app);
                registerCalorieBalanceRoute(this._app);
                registerComplaintRoutes(this._app);
                registerAllergyRoutes(this._app);
                registerHeartPointRoutes(this._app);
                registerDoctorNoteRoutes(this._app);
                registerPhysicalActivityRoutes(this._app);
                registerKnowledgeNuggetRoutes(this._app);
                registerOrderRoutes(this._app);
                registerWaterConsumptionRoutes(this._app);
                registerEmergencyContactRoutes(this._app);
                registerSleepRoutes(this._app);
                registerEmergencyEventRoutes(this._app);
                registerMeditationtRoutes(this._app);
                registerPatientDocumentRoutes(this._app);
                registerDocumentSharingRoutes(this._app);
                registerSymptomTypeRoutes(this._app);
                registerSymptomRoutes(this._app);
                registerSymptomAssessmentRoutes(this._app);
                registerSymptomAssessmentTemplateRoutes(this._app);
                registerBloodGlucoseRoutes(this._app);
                registerDiagnosisRoutes(this._app);
                registerHowDoYouFeelRoutes(this._app);
                registerDrugRoutes(this._app);
                registerUserDeviceDetailsRoutes(this._app);
                registerGoalRoutes(this._app);
                registerFileResourceRoutes(this._app);
                registerMedicationRoutes(this._app);
                registerMedicationConsumptionRoutes(this._app);
                registerUserTaskRoutes(this._app);
                registerMedicalConditionRoutes(this._app);
                registerDailyAssessmentRoutes(this._app);
                registerCareplanRoutes(this._app);
                registerAssessmentRoutes(this._app);
                registerAssessmentTemplateRoutes(this._app);
                registerHealthPriorityRoutes(this._app);
                registerActionPlanRoutes(this._app);
                registerFormsRoutes(this._app);
                registerCustomTaskRoutes(this._app);
                registerBloodCholesterolRoutes(this._app);
                registerStandRoutes(this._app);
                registerFoodComponentMonitoringRoutes(this._app);

                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
