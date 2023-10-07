import express from 'express';
import { Loader } from '../../../startup/loader';
import { ClinicalTypesController } from './clinical.types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ClinicalTypesController();

    router.get('/severities', controller.getSeverities);
    router.get('/clinical-validation-statuses', controller.getClinicalValidationStatuses);
    router.get('/interpretations', controller.getInterpretations);

    app.use('/api/v1/clinical/types', router);
};
