import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative KoboToolbox integration tests', function() {

    var agent = request.agent(infra._app);

    it('229 - Negative - Connect to kobo-toolbox api', function(done) {
        loadConnectKoboToolBoxModel();
        const createModel = getTestData("ConnectKoboToolBoxModel");
        agent
            .post(`/api/v1/clinical/forms/provider/KoboToolbox/connect`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                              
            })
            .expect(403, done);
    });

    it('230 - Negative - Get forms list', function(done) {
       
        agent
            .get(`/api/v1/clinical/forms/provider/KoboToolbox/forms`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('231 - Negative - Schedule assessment with generated template', function(done) {
        loadAssessmentModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                        
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadConnectKoboToolBoxModel = async (
) => {
    const model = {
       
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
