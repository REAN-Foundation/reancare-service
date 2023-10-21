import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FormsController } from '../../../clinical/assessment/forms/forms.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FormsController();

    //Connects with Form provider with user's stored credentials.
    //If the credentials are not provided, credentials are taken up from the database if they exists for the user
    router.post('/provider/:providerCode/connect', auth('Forms.Connect'), controller.connect);

    //Get list of forms for the user with an account with given provider
    router.get('/provider/:providerCode/forms', auth('Forms.GetFormsList'), controller.getFormsList);

    //Import form as assessment template
    //If the forms has already imported but with previous version, a new assessment template is created with new version
    router.post('/provider/:providerCode/import-form/:providerFormId',
        auth('Forms.ImportFormAsAssessmentTemplate'), controller.importFormAsAssessmentTemplate);

    //Export assessment template as a form (Either as XLS form or custom format of the form provider)
    // router.get('/provider/:providerCode/export-template-as-form/:assessmentTemplateId',
    //     auth('Forms.ExportAssessmentTemplateAsForm'), controller.exportAssessmentTemplateAsForm);

    //Add assessment template to the forms provider
    // router.post('/provider/:providerCode/add-template-as-form/:assessmentTemplateId',
    //     auth('Forms.AddAssessmentTemplateAsForm'), controller.addAssessmentTemplateAsForm);

    //Import form submissions
    router.post('/provider/:providerCode/import-form-submissions/:providerFormId',
        auth('Forms.ImportFormSubmissions'), controller.importFormSubmissions);

    app.use('/api/v1/clinical/forms', router);
};
