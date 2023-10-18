import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe.skip('75 - KoboToolbox integration tests', function() {

    var agent = request.agent(infra._app);

    it('75:01 -> Connect to kobo-toolbox api', function(done) {
        loadConnectKoboToolBoxModel();
        const createModel = getTestData("ConnectKoboToolBoxModel");
        agent
            .post(`/api/v1/clinical/forms/provider/KoboToolbox/connect`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('Connected');
                expect(response.body.Data.Connected).to.equal(true);
                              
            })
            .expect(200, done);
    });

    it('75:02 -> Get forms list', function(done) {
       
        agent
            .get(`/api/v1/clinical/forms/provider/KoboToolbox/forms`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });


    it('75:03 -> Schedule assessment with generated template', function(done) {
        loadAssessmentModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Assessment.id, 'AssessmentId');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScheduledAt');
            
                setTestData(response.body.Data.Assessment.id, 'AssessmentId');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                        
            })
            .expect(201, done);
    });

    it('75:04 -> Negative - Connect to kobo-toolbox api', function(done) {
        loadNegativeConnectKoboToolBoxModel();
        const createModel = getTestData("NegativeConnectKoboToolBoxModel");
        agent
            .post(`/api/v1/clinical/forms/provider/KoboToolbox/connect`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                              
            })
            .expect(403, done);
    });

    it('75:05 -> Negative - Get forms list', function(done) {
       
        agent
            .get(`/api/v1/clinical/forms/provider/KoboToolbox/forms`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('75:06 -> Negative - Schedule assessment with generated template', function(done) {
        loadAssessmentModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                        
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadConnectKoboToolBoxModel = async (
) => {
    const model = {
        BaseUrl      : `${process.env.TEST_KOBO_BASE_URL}`,
        SecondaryUrl : `${process.env.TEST_KOBO_SECONDARY_URL}`,
        Token        : `${process.env.TEST_KOBO_TOKEN}`
    };
    setTestData(model, "ConnectKoboToolBoxModel");
};

export const loadAssessmentModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        AssessmentTemplateId : getTestData("AssessmentTemplateScoreId"),
        ScheduledDate        : faker.date.future()
    };
    setTestData(model, "AssessmentCreateModel");
};

export const loadNegativeConnectKoboToolBoxModel = async (
) => {
    const model = {
        Token        : `${process.env.TEST_KOBO_TOKEN}`
    };
    setTestData(model, "NegativeConnectKoboToolBoxModel");
};
