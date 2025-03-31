import express from 'express';
import { DeliveryController } from './delivery.controller';
import { DeliveryAuth } from './delivery.auth';
import { auth } from '../../../../auth/auth.handler';

// import { auth } from 'src/auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DeliveryController();

    router.post('/', auth(DeliveryAuth.create), controller.create);
    router.get('/search', auth (DeliveryAuth.search),controller.search);
    router.get('/:id', auth(DeliveryAuth.getById),controller.getById);
    router.put('/:id', auth(DeliveryAuth.update),controller.update);
    router.delete('/:id', auth(DeliveryAuth.delete), controller.delete);

    router.post('/:id/postnatal-visits', auth(DeliveryAuth.createPostnatalVisit), controller.createPostnatalVisit);
    router.get('/:id/postnatal-visits/search', auth (DeliveryAuth.searchPostnatalVisit),controller.searchPostnatalVisit);
    router.get('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.getPostnatalVisitById),controller.getPostnatalVisitById);
    router.put('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.updatePostnatalVisit),controller.updatePostnatalVisit);
    router.delete('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.deletePostnatalVisit), controller.deletePostnatalVisit);

    router.post('/:id/postnatal-medications', auth(DeliveryAuth.createPostnatalMedication), controller.createPostnatalMedication);
    router.get('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.getPostnatalMedicationById), controller.getPostnatalMedicationById);
    router.put('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.updatePostnatalMedication), controller.updatePostnatalMedication);
    router.delete('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.deletePostnatalMedication), controller.deletePostnatalMedication);


    app.use('/api/v1/clinical/maternity/maternity-deliveries', router);
};
