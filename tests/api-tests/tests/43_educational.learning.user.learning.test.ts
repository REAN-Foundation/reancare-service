import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { ProgressStatus } from '../../../src/domain.types/miscellaneous/system.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('43 - User learning tests', function() {

    var agent = request.agent(infra._app);

    it('43:01 -> Get User Learning Paths', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/learning-paths`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:02 -> Get User Course Contents', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/course-contents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:03 -> Get Learning Path Progress', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/learning-paths/${getTestData("LearningPathId")}/progress`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:04 -> Get Course Progress', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/courses/${getTestData("CourseId")}/progress`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:05 -> Get Module Progress', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/modules/${getTestData("CourseModuleId")}/progress`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:06 -> Get Content Progress', function(done) {
        agent
            .get(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/contents/${getTestData("CourseContentId")}/progress`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('43:07 -> Update User Learning', function(done) {
        loadUserLearningUpdateModel();
        const updateModel = getTestData("UserLearningUpdateModel");
        agent
            .put(`/api/v1/educational/user-learnings/${getTestData("PatientUserId")}/contents/${getTestData("CourseContentId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.courseContent).to.have.property('UserId');
                expect(response.body.Data.courseContent).to.have.property('ContentId');
                expect(response.body.Data.courseContent).to.have.property('LearningPathId');
                expect(response.body.Data.courseContent).to.have.property('ActionId');
                expect(response.body.Data.courseContent).to.have.property('ProgressStatus');
                expect(response.body.Data.courseContent).to.have.property('PercentageCompletion');

                expect(response.body.Data.courseContent.UserId).to.equal(getTestData("UserLearningUpdateModel").UserId);
                expect(response.body.Data.courseContent.ContentId).to.equal(getTestData("UserLearningUpdateModel").ContentId);
                expect(response.body.Data.courseContent.LearningPathId).to.equal(getTestData("UserLearningUpdateModel").LearningPathId);
                expect(response.body.Data.courseContent.ActionId).to.equal(getTestData("UserLearningUpdateModel").ActionId);
                
            })
            .expect(201, done);
    });

});

// ///////////////////////////////////////////////////////////////////////////

export const loadUserLearningUpdateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        ContentId            : getTestData("CourseContentId"),
        LearningPathId       : getTestData("LearningPathId"),
        ActionId             : faker.string.uuid(),
        ProgressStatus       : getRandomEnumValue(ProgressStatus),
        PercentageCompletion : faker.number.int(100)
  
    };
    setTestData(model, "UserLearningUpdateModel");
};

