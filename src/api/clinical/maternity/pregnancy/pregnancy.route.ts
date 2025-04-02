import express from 'express';
import { PregnancyController } from './pregnancy.controller';
import { PregnancyAuth } from './pregnancy.auth';
import { auth } from '../../../../auth/auth.handler';

// import { auth } from 'src/auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PregnancyController();

    router.post('/', auth(PregnancyAuth.create), controller.create);
    router.get('/search', auth (PregnancyAuth.search),controller.search);
    router.get('/:id', auth(PregnancyAuth.getById),controller.getById);
    router.put('/:id', auth(PregnancyAuth.update),controller.update);
    router.delete('/:id', auth(PregnancyAuth.delete), controller.delete);

    router.post('/:id/vaccinations', auth(PregnancyAuth.createVaccination), controller.createVaccination);
    router.get('/:id/vaccinations/search', auth (PregnancyAuth.searchVaccination),controller.searchVaccination);
    router.get('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.getVaccinationById),controller.getVaccinationById);
    router.put('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.updateVaccination),controller.updateVaccination);
    router.delete('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.deleteVaccination), controller.deleteVaccination);

    app.use('/api/v1/clinical/maternity/maternity-pregnancies', router);
};
