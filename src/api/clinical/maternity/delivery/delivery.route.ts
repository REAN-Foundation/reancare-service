import express from 'express';
import { DeliveryController } from './delivery.controller';
import { DeliveryAuth } from './delivery.auth';
import { auth } from '../../../../auth/auth.handler';

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
    router.get('/:id/postnatal-visits/search', auth (DeliveryAuth.searchPostnatalVisits),controller.searchPostnatalVisits);
    router.get('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.getPostnatalVisitById),controller.getPostnatalVisitById);
    router.put('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.updatePostnatalVisit),controller.updatePostnatalVisit);
    router.delete('/:id/postnatal-visits/:postnatalVisitId', auth(DeliveryAuth.deletePostnatalVisit), controller.deletePostnatalVisit);

    router.post('/:id/postnatal-medications', auth(DeliveryAuth.createPostnatalMedication), controller.createPostnatalMedication);
    router.get('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.getPostnatalMedicationById), controller.getPostnatalMedicationById);
    router.put('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.updatePostnatalMedication), controller.updatePostnatalMedication);
    router.delete('/:id/postnatal-medications/:postnatalMedicationId', auth(DeliveryAuth.deletePostnatalMedication), controller.deletePostnatalMedication);

    router.post('/:id/complications', auth(DeliveryAuth.createComplication), controller.createComplication);
    router.get('/:id/complications/search', auth (DeliveryAuth.searchComplications),controller.searchComplications);
    router.get('/:id/complications/:complicationId', auth(DeliveryAuth.getComplicationById),controller.getComplicationById);
    router.put('/:id/complications/:complicationId', auth(DeliveryAuth.updateComplication),controller.updateComplication);
    router.delete('/:id/complications/:complicationId', auth(DeliveryAuth.deleteComplication), controller.deleteComplication);

    router.post('/:id/babies', auth(DeliveryAuth.createBaby), controller.createBaby);
    router.get('/:id/babies/:babyId', auth (DeliveryAuth.getBabyById),controller.getBabyById);

    router.post('/:id/breastfeedings', auth(DeliveryAuth.createBreastfeeding), controller.createBreastfeeding);
    router.get('/:id/breastfeedings/:breastfeedingId', auth(DeliveryAuth.getBreastfeedingById),controller.getBreastfeedingById);
    router.put('/:id/breastfeedings/:breastfeedingId', auth(DeliveryAuth.updateBreastfeeding),controller.updateBreastfeeding);

    app.use('/api/v1/clinical/maternity/maternity-deliveries', router);
};
