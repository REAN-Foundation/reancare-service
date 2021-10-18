import express from "express";
import { register as registerUserRoutes } from "./user.routes";
import { register as registerClientRoutes } from "./api.client.routes";
import { register as registerAddressRoutes } from "./address.routes";
import { register as registerPatientRoutes } from "./patient/patient.routes";
import { register as registerDoctorRoutes } from "./doctor.routes";
import { register as registerOrganizationRoutes } from './organization.routes';
import { register as registerPersonRoutes } from './person.routes';
import { register as registerTypesRoutes } from './types.routes';
import { register as registerBloodPressureRoutes } from './biometrics/blood.pressure.routes';
import { register as registerBodyWeightRoutes } from './biometrics/body.weight.routes';
import { register as registerBodyHeightRoutes } from './biometrics/body.height.routes';
import { register as registerPatientHealthProfileRoutes } from './patient/health.profile.routes';
import { register as registerBiometricsBloodOxygenSaturationRoutes } from './biometrics/blood.oxygen.saturation.routes';
import { register as registerHealthProfileRoutes } from './patient/health.profile.routes';
import { register as registerStepCountRoutes } from './daily.records/step.count.routes';
import { register as registerBiometricsPulse } from './biometrics/pulse.routes';
import { register as registerBodyTemperatureRoutes } from './biometrics/body.temperature.routes';
import { register as registerMoveMinutesRoutes } from './daily.records/move.minutes.routes';
import { register as registerCalorieBalanceRoute } from './daily.records/calorie.balance.routes';
import { register as registerComplaintRoutes } from './patient/complaint.routes';
import { register as registerAllergyRoutes } from './patient/allergy.route';
import { register as registerHeartPointRoutes } from './daily.records/heart.points.routes';
import { register as registerEmergencyContactRoutes } from './patient/emergency.contact.route';
import { register as registerSleepRoutes } from './daily.records/sleep.routes';
import { register as registerEmergencyEventRoutes } from './emergency.event.routes';
import { register as registerMeditationtRoutes } from './exercise/meditation.routes';
import { register as registerMedicalConditionRoutes } from './static types/medical.condition.routes';

import { Logger } from "../../common/logger";

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
                registerHealthProfileRoutes(this._app);
                registerStepCountRoutes(this._app);
                registerBiometricsPulse(this._app);
                registerBodyTemperatureRoutes(this._app);
                registerMoveMinutesRoutes(this._app);
                registerCalorieBalanceRoute(this._app);
                registerComplaintRoutes(this._app);
                registerAllergyRoutes(this._app);
                registerHeartPointRoutes(this._app);
                registerEmergencyContactRoutes(this._app);
                registerSleepRoutes(this._app);
                registerEmergencyEventRoutes(this._app);
                registerMeditationtRoutes(this._app);
                registerMedicalConditionRoutes(this._app);

                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
