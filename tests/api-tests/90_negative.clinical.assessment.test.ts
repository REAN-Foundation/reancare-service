import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Assessment tests', function() {

    var agent = request.agent(infra._app);

    it('239 - Negative - Create assessment', function(done) {
        loadAssessmentCreateModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
      
            })
            .expect(400, done);
    });

    it('240 - Negative - Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('NodeAssessmentd')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(400, done);
    });

    it('241 - Negative - Update assessment', function(done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData("AssessmentUpdateModel");
        agent
            .put(`/api/v1/clinical/assessments/${getTestData('NodeAssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('242 - Negative - Delete assessment', function(done) {
   
        agent
            .delete(`/api/v1/clinical/assessments/${getTestData('NodeAssessment')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadAssessmentCreateModel = async (
) => {
    const model = {
        
    };
    setTestData(model, "AssessmentCreateModel");
};

export const loadAssessmentUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Title                : "An updated assessment",
        AssessmentTemplateId : getTestData("NodeAssessmentTemplateId"),
        ScheduledDate        : "2023-10-23T00:00:00.000Z"
          
    };
    setTestData(model, "AssessmentUpdateModel");
};

