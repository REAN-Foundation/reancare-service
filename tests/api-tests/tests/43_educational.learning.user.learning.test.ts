import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { ProgressStatus } from '../../../src/domain.types/miscellaneous/system.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('43 - User learning tests', function () {
    var agent = request.agent(infra._app);

    it('43:01 -> Get User Learning Paths', function (done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData('patientUserId')}/learning-paths`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:02 -> Get User Course Contents', function (done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData('patientUserId')}/course-contents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:03 -> Get Learning Path Progress', function (done) {
        agent
            .get(
                `/api/v1/educational/user-learnings/${getTestData('patientUserId')}/learning-paths/${getTestData(
                    'LearningPathId'
                )}/progress`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:04 -> Get Course Progress', function (done) {
        agent
            .get(
                `/api/v1/educational/user-learnings/${getTestData('patientUserId')}/courses/${getTestData(
                    'courseId'
                )}/progress`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:05 -> Get Module Progress', function (done) {
        agent
            .get(
                `/api/v1/educational/user-learnings/${getTestData('patientUserId')}/modules/${getTestData(
                    'courseModuleId'
                )}/progress`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:06 -> Get Content Progress', function (done) {
        agent
            .get(
                `/api/v1/educational/user-learnings/${getTestData('patientUserId')}/contents/${getTestData(
                    'courseContentId'
                )}/progress`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('43:07 -> Update User Learning', function (done) {
        loadUserLearningUpdateModel();
        const updateModel = getTestData('userLearningUpdateModel');
        agent
            .put(
                `/api/v1/educational/user-learnings/${getTestData('patientUserId')}/contents/${getTestData(
                    'courseContentId'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.courseContent).to.have.property('UserId');
                expect(response.body.Data.courseContent).to.have.property('ContentId');
                expect(response.body.Data.courseContent).to.have.property('LearningPathId');
                expect(response.body.Data.courseContent).to.have.property('ActionId');
                expect(response.body.Data.courseContent).to.have.property('ProgressStatus');
                expect(response.body.Data.courseContent).to.have.property('PercentageCompletion');

                expect(response.body.Data.courseContent.UserId).to.equal(getTestData('userLearningUpdateModel').UserId);
                expect(response.body.Data.courseContent.ContentId).to.equal(
                    getTestData('userLearningUpdateModel').ContentId
                );
                expect(response.body.Data.courseContent.LearningPathId).to.equal(
                    getTestData('userLearningUpdateModel').LearningPathId
                );
                expect(response.body.Data.courseContent.ActionId).to.equal(getTestData('userLearningUpdateModel').ActionId);
            })
            .expect(201, done);
    });
});

//////////////////////////////////////////////////////////////////////////////

export const loadUserLearningUpdateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        ContentId: getTestData('courseContentId'),
        LearningPathId: getTestData('learningPathId'),
        ActionId: faker.string.uuid(),
        ProgressStatus: getRandomEnumValue(ProgressStatus),
        PercentageCompletion: faker.number.int(100),
    };
    setTestData(model, 'userLearningUpdateModel');
};
