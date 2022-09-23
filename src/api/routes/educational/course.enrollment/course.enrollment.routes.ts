import express from 'express';
import { Loader } from '../../../../startup/loader';
import { CourseEnrollmentController } from '../../../controllers/educational/course.enrollment/course.enrollment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CourseEnrollmentController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.enroll);
    router.post('/:enrollmentId/modules/:moduleId/start', authenticator.authenticateClient, authenticator.authenticateUser, controller.startCourseModule);
    router.post('/:enrollmentId/modules/:moduleId/content/:contentId/start', authenticator.authenticateClient, authenticator.authenticateUser, controller.startCourseContent);
    router.get('/:enrollmentId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCourseProgress);
    router.get('/:enrollmentId/modules/:moduleId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getModuleProgress);
    router.get('/:enrollmentId/modules/:moduleId/content/:contentId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContentProgress);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getUserEnrollments);

    app.use('/api/v1/educational/course-enrollments', router);

};
