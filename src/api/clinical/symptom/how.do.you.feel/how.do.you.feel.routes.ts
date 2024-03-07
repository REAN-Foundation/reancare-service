import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HowDoYouFeelController } from './how.do.you.feel.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HowDoYouFeelController();

    router.post('/', auth('Clinical.Symptoms.HowDoYouFeel.Create'), controller.create);
    router.get('/search', auth('Clinical.Symptoms.HowDoYouFeel.Search'), controller.search);
    router.get('/:id', auth('Clinical.Symptoms.HowDoYouFeel.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Symptoms.HowDoYouFeel.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Symptoms.HowDoYouFeel.Delete'), controller.delete);

    app.use('/api/v1/clinical/symptoms/how-do-you-feel', router);
};
