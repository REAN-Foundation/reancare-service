import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Diagnosis tests', function() {

    var agent = request.agent(infra._app);

    it('147 - Negative - Create diagnosis', function(done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData("DiagnosisCreateModel");
        agent
            .post(`/api/v1/clinical/diagnoses/`)
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

    it('148 - Negative - Search diagnosis records', function(done) {
        loadDiagnosisQueryString();
        agent
            .get(`/api/v1/clinical/diagnoses/search${loadDiagnosisQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('149 - Negative - Delete diagnosis', function(done) {
      
        agent
            .delete(`/api/v1/clinical/diagnoses/${getTestData('Diagnosis')}`)
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

export const loadDiagnosisCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "DiagnosisCreateModel");
};

export const loadDiagnosisUpdateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        MedicalCondition          : null,
        Comments                  : "Condition becomes worse day by day",
        IsClinicallyActive        : true,
        ValidationStatus          : "Negated",
        Interpretation            : "Critically abnormal",
        OnsetDate                 : "2023-09-15T00:00:00.000Z",
        EndDate                   : "2023-09-25T00:00:00.000Z"
    };
    setTestData(model, "DiagnosisUpdateModel");
};

function loadDiagnosisQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?onSetDateFrom=2023-09-14&onSetDateTo=2023-10-15';
    return queryString;
}
