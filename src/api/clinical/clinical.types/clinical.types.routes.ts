import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { ClinicalTypesController } from './clinical.types.controller';
import { ClinicalTypeAuth } from './clinical.type.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ClinicalTypesController();

    router.get('/severities', auth(ClinicalTypeAuth.getSeverities), controller.getSeverities);
    router.get('/clinical-validation-statuses', auth(ClinicalTypeAuth.getClinicalValidationStatuses), controller.getClinicalValidationStatuses);
    router.get('/interpretations', auth(ClinicalTypeAuth.getInterpretations), controller.getInterpretations);

    app.use('/api/v1/clinical/types', router);
};
