import express from 'express';
import { Loader } from '../../../startup/loader';
import { ClinicalTypesController } from './clinical.types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ClinicalTypesController();

    router.get('/severities', authenticator.authenticateClient, controller.getSeverities);
    router.get('/clinical-validation-statuses', authenticator.authenticateClient, controller.getClinicalValidationStatuses);
    router.get('/interpretations', authenticator.authenticateClient, controller.getInterpretations);

    app.use('/api/v1/clinical/types', router);
};
