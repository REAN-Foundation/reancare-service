import { register as registerUserRoutes } from "./user.routes";
import { register as registerClientRoutes } from "./api.client.routes";
import { register as registerAddressRoutes } from "./address.routes";
import { register as registerPatientRoutes } from "./patient.routes";

////////////////////////////////////////////////////////////////////////////////////

export class Router {
    private _app = null;

    constructor(app) {
        this._app = app;
    }

    public init = async () => {
        return new Promise((resolve, reject) => {
            try {
                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message: `REANCare API [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerUserRoutes(this._app);
                registerAddressRoutes(this._app);
                registerClientRoutes(this._app);
                registerPatientRoutes(this._app);

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
