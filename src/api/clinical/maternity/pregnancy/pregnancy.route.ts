import express from 'express';
import { PregnancyController } from './pregnancy.controller';
import { PregnancyAuth } from './pregnancy.auth';
import { auth } from '../../../../auth/auth.handler';

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
    router.get('/:id/vaccinations/search', auth (PregnancyAuth.searchVaccinations),controller.searchVaccinations);
    router.get('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.getVaccinationById),controller.getVaccinationById);
    router.put('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.updateVaccination),controller.updateVaccination);
    router.delete('/:id/vaccinations/:vaccinationId', auth(PregnancyAuth.deleteVaccination), controller.deleteVaccination);
    
    router.post('/:id/antenatal-visit',auth(PregnancyAuth.createAntenatalVisit),controller.createAntenatalVisit);
    router.get('/:id/antenatal-visit/:antenatalVisitId',auth(PregnancyAuth.getAntenatalVisitById),controller.getAntenatalVisitById);
    router.put('/:id/antenatal-visit/:antenatalVisitId',auth(PregnancyAuth.updateAntenatalVisit),controller.updateAntenatalVisit);
    router.delete('/:id/antenatal-visit/:antenatalVisitId',auth(PregnancyAuth.deleteAntenatalVisit),controller.deleteAntenatalVisit);

    router.post('/:id/antenatal-medication',auth(PregnancyAuth.createAntenatalMedication),controller.createAntenatalMedication);
    router.get('/:id/antenatal-medication/:antenatalMedicationId',auth(PregnancyAuth.getAntenatalMedicationById),controller.getAntenatalMedicationById);
    router.put('/:id/antenatal-medication/:antenatalMedicationId',auth(PregnancyAuth.updateAntenatalMedication),controller.updateAntenatalMedication);
    router.delete('/:id/antenatal-medication/:antenatalMedicationId',auth(PregnancyAuth.deleteAntenatalMedication),controller.deleteAntenatalMedication);

    router.post("/:id/tests", auth(PregnancyAuth.createTest), controller.createTest);
    router.get("/:id/tests/:testId", auth(PregnancyAuth.getTestById), controller.getTestById);
    router.put("/:id/tests/:testId", auth(PregnancyAuth.updateTest), controller.updateTest);
    router.delete("/:id/tests/:testId", auth(PregnancyAuth.deleteTest), controller.deleteTest);
   
    app.use('/api/v1/clinical/maternity/maternity-pregnancies', router);
};
