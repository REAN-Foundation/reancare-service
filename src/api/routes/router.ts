import express from "express";
import { register as registerUserRoutes } from "./user.routes";
import { register as registerClientRoutes } from "./api.client.routes";
import { register as registerAddressRoutes } from "./address.routes";
import { register as registerPatientRoutes } from "./patient/patient.routes";
import { register as registerDoctorRoutes } from "./doctor.routes";
import { register as registerOrganizationRoutes } from './organization.routes';
import { register as registerPersonRoutes } from './person.routes';
import { register as registerTypesRoutes } from './types.routes';
import { register as registerBiometricsBloodOxygenSaturationRoutes } from './biometrics/blood.oxygen.saturation.routes';
import { register as registerHealthProfileRoutes } from './patient/health.profile.routes';
import { register as registerBiometricsPulse } from './biometrics/pulse.routes';

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
                registerBiometricsBloodOxygenSaturationRoutes(this._app);
                registerPersonRoutes(this._app);
                registerOrganizationRoutes(this._app);
                registerHealthProfileRoutes(this._app);
                registerBiometricsPulse(this._app);

                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
