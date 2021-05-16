
import app from './app';

require('dotenv-flow').config();
const Logger = require('./utilities/Logger');
const OpenmrsSessionHandler = require("./openmrs/OpenmrsSessionHandler");
const AhaInterface = require("./aha/AhaInterface");
const NotificationService = require('./services/Communication/Notification.Service');
const Scheduler = require("./utilities/JobScheduler");
const helmet = require('helmet');
const cors = require('cors');
const qs = require('querystring');

const app = express();

function startServer() {
    setupDB();
    setMiddlewares();
    setRoutes();
    start();
}

function setupDB() {

    const db = require("./database/connection");

    db.sequelize
        .authenticate()
        .then(() => {
            Logger.Log('Database connection has been established successfully.');
        })
        .catch(error => {
            Logger.LogError('Unable to connect to the database:' + error.message);
        });
}

function setRoutes() {

    require("./routes/Appointment.Routes")(app);
    require("./routes/AppointmentStatus.Routes")(app);
    require("./routes/Patient.Routes")(app);
    require("./routes/Doctor.Routes")(app);
    require("./routes/Lab.Routes")(app);
    require("./routes/Pharmacy.Routes")(app);
    require("./routes/User.Routes")(app);
    require("./routes/DoctorVisit.Routes")(app);
    require("./routes/DoctorNote.Routes")(app);
    require("./routes/Biometrics.Routes")(app);
    require("./routes/Symptom.Routes")(app);
    require("./routes/Allergy.Routes")(app);
    require("./routes/Diagnosis.Routes")(app);
    require("./routes/DrugOrder.Routes")(app);
    require("./routes/Medication.Routes")(app);
    require("./routes/MedicationConsumption.Routes")(app);
    require("./routes/PathologyOrder.Routes")(app);
    require("./routes/RadiologyOrder.Routes")(app);
    require("./routes/Types.Routes")(app);
    require("./routes/PatientComplaint.Routes")(app);
    require("./routes/PatientMedicalProfile.Routes")(app);
    require("./routes/PathologyTest.Routes")(app);
    require("./routes/PathologyTestResult.Routes")(app);
    require("./routes/LabVisit.Routes")(app);
    require("./routes/Resource.Routes")(app);
    require("./routes/EmergencyContact.Routes")(app);
    require("./routes/PatientTask.Routes")(app);

    //Aha routes
    require("./aha/routes/AhaCarePlanTeam.Routes")(app);    
    require("./aha/routes/AhaCarePlanAssessment.Routes")(app);
    require("./aha/routes/AhaCarePlan.Routes")(app);
    require("./aha/routes/AhaCarePlanTask.Routes")(app);
    require("./aha/routes/AhaCarePlanGoal.Routes")(app);
    //Other
    require("./routes/Miscellaneous.Routes")(app);

    //Handling the base route
    app.get("/", (req, res) => {
        res.send({ message: "Health Care App BFF Service (V0.01)" });
    });
}

function setMiddlewares() {

    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    //Add middleware for file uploads
    const fileUpload = require('express-fileupload');
    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        preserveExtension: true,
        createParentPath: true,
        parseNested: true,
        useTempFiles: true,
        tempFileDir: '/tmp/uploads/'
    }));
}

function start() {

    (async () => {

        //Logger.Log('GOOGLE_APPLICATION_CREDENTIALS : ' + process.env.GOOGLE_APPLICATION_CREDENTIALS);

        //Make admin login to OpenMRS
        await OpenmrsSessionHandler.LogAdminToOpenMRS();

        NotificationService.Initialize();

        //Seed OpenMRS with HCA specific data
        const openmrsSeeder = require('./openmrs/OpenmrsSeeder');
        await openmrsSeeder.SeedOpenMRS();

        const seeder = require('./services/Seeder');
        await seeder.Seed();

        //Seed Aha
        const ahaSeeder = require('./aha/AhaSeeder');
        await ahaSeeder.SeedAha();

        //Cache OpenMRS frequently used read-only data
        Logger.Log('Started updating cache...');
        const cache = require('./openmrs/OpenmrsCache');
        await cache.RefreshCache();
        Logger.Log('Updated cache successfully!');

        await AhaInterface.Connect();

        //Use a sample concept uuid to hit-check user session validity
        var sample_uuid = cache.GetSampleConcept_uuid();
        OpenmrsSessionHandler.SetSampleConcept_uuid(sample_uuid);

        Scheduler.ScheduleCronJobs();

        

        const port = process.env.PORT;
        var server = app.listen(port, () => {
            Logger.Log("xnode is up and listening on port " + process.env.PORT.toString());
            app.emit("appStarted");
        });
        module.exports.server = server;
    })();

}

startServer();

module.exports.app = app;
