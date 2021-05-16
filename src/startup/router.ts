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

                require('./routes/user.routes')(this._app);
                require('./routes/patient.routes')(this._app);

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
