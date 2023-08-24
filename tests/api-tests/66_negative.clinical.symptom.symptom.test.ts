import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Symptom tests', function() {

    var agent = request.agent(infra._app);

    it('167 - Negative - Create symptom', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('168 - Negative - Search symptom records', function(done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('169 - Negative - Delete symptom', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/${getTestData('Symptom')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadSymptomCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "SymptomCreateModel");
};

export const loadSymptomUpdateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        AssessmentId   : getTestData("AssessmentId"),
        SymptomTypeId  : getTestData("SymptomTypeId"),
        IsPresent      : true,
        Severity       : '2',
        Status         : '2',
        Interpretation : '2',
        Comments       : "The chronic hypertension for the patient with critically high levels."
    };
    setTestData(model, "SymptomUpdateModel");
};

function loadSymptomQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?fromDate=2021-05-30';
    return queryString;
}
