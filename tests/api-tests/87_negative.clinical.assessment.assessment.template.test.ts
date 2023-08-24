import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative Cholesterol Demographic Assessment template Copy tests', function() {

    var agent = request.agent(infra._app);

    it('227 - Negative - Create Cholesterol Demographic Assessment', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('228 - Negative - Add question node- 1', function(done) {
        loadNodeCreateModel();
        const createModel = getTestData("NodeCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateId_1')}/nodes`)
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

});

///////////////////////////////////////////////////////////////////////

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
       
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadNodeCreateModel = async (
) => {
    const model = {
       
    };
    setTestData(model, "NodeCreateModel");
};
