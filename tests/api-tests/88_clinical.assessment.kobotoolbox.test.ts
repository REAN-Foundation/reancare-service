import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('KoboToolbox integration tests', function() {

    var agent = request.agent(infra._app);

    it('401 - Connect to kobo-toolbox api', function(done) {
        loadConnectKoboToolBoxModel();
        const createModel = getTestData("ConnectKoboToolBoxModel");
        agent
            .post(`/api/v1/clinical/forms/provider/KoboToolbox/connect`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('Connected');
                expect(response.body.Data.Connected).to.equal(true);
                              
            })
            .expect(200, done);
    });

    it('402 - Get forms list', function(done) {
       
        agent
            .get(`/api/v1/clinical/forms/provider/KoboToolbox/forms`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    // it('403 - import form as assessment template', function(done) {
    //     loadConnectKoboToolBoxModel();
    //     const createModel = getTestData("ConnectKoboToolBoxModel");
    //     agent
    //         .post(`/api/v1/clinical/forms/provider/KoboToolbox/import-form/911036`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
    //         .send(createModel)
    //         .expect(response => {
    //             expect(response.body.Data).to.have.property('Connected');
    //             expect(response.body.Data.Connected).to.equal(true);
                            
    //         })
    //         .expect(200, done);
    // });

    // it('404 - import submitted form data as assessment', function(done) {
    //     loadConnectKoboToolBoxModel();
    //     const createModel = getTestData("ConnectKoboToolBoxModel");
    //     agent
    //         .post(`/api/v1/clinical/forms/provider/KoboToolbox/import-form-submissions/911036`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
    //         .send(createModel)
    //         .expect(response => {
    //             expect(response.body.Data).to.have.property('Connected');
    //             expect(response.body.Data.Connected).to.equal(true);
                          
    //         })
    //         .expect(200, done);
    // });

    it('405 - Schedule assessment with generated template', function(done) {
        loadAssessmentModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Assessment.ScheduledDate).to.equal(getTestData("AssessmentCreateModel").ScheduledAt);
                        
            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadConnectKoboToolBoxModel = async (
) => {
    const model = {
        BaseUrl      : "https://kc.kobotoolbox.org/api/",
        SecondaryUrl : "https://kf.kobotoolbox.org/api/",
        Token        : "058f77bc58acfc6874b3bca738b438f0f45d9c31"
    };
    setTestData(model, "ConnectKoboToolBoxModel");
};

export const loadAssessmentModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        AssessmentTemplateId : getTestData("AssessmentTemplateScoreId"),
        ScheduledDate        : "2023-08-09"
    };
    setTestData(model, "AssessmentCreateModel");
};
