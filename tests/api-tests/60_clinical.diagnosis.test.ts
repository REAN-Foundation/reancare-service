import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Diagnosis tests', function() {

    var agent = request.agent(infra._app);

    it('269 - Create diagnosis', function(done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData("DiagnosisCreateModel");
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Diagnosis.id, 'DiagnosisId');
                expect(response.body.Data.Diagnosis).to.have.property('id');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalCondition');
                expect(response.body.Data.Diagnosis).to.have.property('Comments');
                expect(response.body.Data.Diagnosis).to.have.property('IsClinicallyActive');
                expect(response.body.Data.Diagnosis).to.have.property('ValidationStatus');
                expect(response.body.Data.Diagnosis).to.have.property('Interpretation');
                expect(response.body.Data.Diagnosis).to.have.property('OnsetDate');
                expect(response.body.Data.Diagnosis).to.have.property('EndDate');

                setTestData(response.body.Data.Diagnosis.id, 'DiagnosisId');

                expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(getTestData("DiagnosisCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Diagnosis.MedicalCondition).to.equal(getTestData("DiagnosisCreateModel").MedicalCondition);
                expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData("DiagnosisCreateModel").Comments);
                expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(getTestData("DiagnosisCreateModel").IsClinicallyActive);
                expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(getTestData("DiagnosisCreateModel").ValidationStatus);
                expect(response.body.Data.Diagnosis.Interpretation).to.equal(getTestData("DiagnosisCreateModel").Interpretation);
                expect(response.body.Data.Diagnosis.OnsetDate).to.equal(getTestData("DiagnosisCreateModel").OnsetDate);
                expect(response.body.Data.Diagnosis.EndDate).to.equal(getTestData("DiagnosisCreateModel").EndDate);

            })
            .expect(201, done);
    });

    it('270 - Get diagnosis by id', function(done) {

        agent
            .get(`/api/v1/clinical/diagnoses/${getTestData('DiagnosisId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Diagnosis).to.have.property('id');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalCondition');
                expect(response.body.Data.Diagnosis).to.have.property('Comments');
                expect(response.body.Data.Diagnosis).to.have.property('IsClinicallyActive');
                expect(response.body.Data.Diagnosis).to.have.property('ValidationStatus');
                expect(response.body.Data.Diagnosis).to.have.property('Interpretation');
                expect(response.body.Data.Diagnosis).to.have.property('OnsetDate');
                expect(response.body.Data.Diagnosis).to.have.property('EndDate');

                expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(getTestData("DiagnosisCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Diagnosis.MedicalCondition).to.equal(getTestData("DiagnosisCreateModel").MedicalCondition);
                expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData("DiagnosisCreateModel").Comments);
                expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(getTestData("DiagnosisCreateModel").IsClinicallyActive);
                expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(getTestData("DiagnosisCreateModel").ValidationStatus);
                expect(response.body.Data.Diagnosis.Interpretation).to.equal(getTestData("DiagnosisCreateModel").Interpretation);
                expect(response.body.Data.Diagnosis.OnsetDate).to.equal(getTestData("DiagnosisCreateModel").OnsetDate);
                expect(response.body.Data.Diagnosis.EndDate).to.equal(getTestData("DiagnosisCreateModel").EndDate);

            })
            .expect(200, done);
    });

    it('271 - Search diagnosis records', function(done) {
        loadDiagnosisQueryString();
        agent
            .get(`/api/v1/clinical/diagnoses/search${loadDiagnosisQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Diagnosis).to.have.property('TotalCount');
                expect(response.body.Data.Diagnosis).to.have.property('RetrievedCount');
                expect(response.body.Data.Diagnosis).to.have.property('PageIndex');
                expect(response.body.Data.Diagnosis).to.have.property('ItemsPerPage');
                expect(response.body.Data.Diagnosis).to.have.property('Order');
                expect(response.body.Data.Diagnosis.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Diagnosis.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Diagnosis.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('272 - Update diagnosis', function(done) {
        loadDiagnosisUpdateModel();
        const updateModel = getTestData("DiagnosisUpdateModel");
        agent
            .put(`/api/v1/clinical/diagnoses/${getTestData('DiagnosisId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Diagnosis).to.have.property('id');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalCondition');
                expect(response.body.Data.Diagnosis).to.have.property('Comments');
                expect(response.body.Data.Diagnosis).to.have.property('IsClinicallyActive');
                expect(response.body.Data.Diagnosis).to.have.property('ValidationStatus');
                expect(response.body.Data.Diagnosis).to.have.property('Interpretation');
                expect(response.body.Data.Diagnosis).to.have.property('OnsetDate');
                expect(response.body.Data.Diagnosis).to.have.property('EndDate');

                expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(getTestData("DiagnosisUpdateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Diagnosis.MedicalCondition).to.equal(getTestData("DiagnosisUpdateModel").MedicalCondition);
                expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData("DiagnosisUpdateModel").Comments);
                expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(getTestData("DiagnosisUpdateModel").IsClinicallyActive);
                expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(getTestData("DiagnosisUpdateModel").ValidationStatus);
                expect(response.body.Data.Diagnosis.Interpretation).to.equal(getTestData("DiagnosisUpdateModel").Interpretation);
                expect(response.body.Data.Diagnosis.OnsetDate).to.equal(getTestData("DiagnosisUpdateModel").OnsetDate);
                expect(response.body.Data.Diagnosis.EndDate).to.equal(getTestData("DiagnosisUpdateModel").EndDate);
            })
            .expect(200, done);
    });

    it('273 - Delete diagnosis', function(done) {
      
        agent
            .delete(`/api/v1/clinical/diagnoses/${getTestData('DiagnosisId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create diagnosis again', function(done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData("DiagnosisCreateModel");
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Diagnosis.id, 'DiagnosisId');
                expect(response.body.Data.Diagnosis).to.have.property('id');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Diagnosis).to.have.property('MedicalCondition');
                expect(response.body.Data.Diagnosis).to.have.property('Comments');
                expect(response.body.Data.Diagnosis).to.have.property('IsClinicallyActive');
                expect(response.body.Data.Diagnosis).to.have.property('ValidationStatus');
                expect(response.body.Data.Diagnosis).to.have.property('Interpretation');
                expect(response.body.Data.Diagnosis).to.have.property('OnsetDate');
                expect(response.body.Data.Diagnosis).to.have.property('EndDate');

                setTestData(response.body.Data.Diagnosis.id, 'DiagnosisId');

                expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(getTestData("DiagnosisCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Diagnosis.MedicalCondition).to.equal(getTestData("DiagnosisCreateModel").MedicalCondition);
                expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData("DiagnosisCreateModel").Comments);
                expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(getTestData("DiagnosisCreateModel").IsClinicallyActive);
                expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(getTestData("DiagnosisCreateModel").ValidationStatus);
                expect(response.body.Data.Diagnosis.Interpretation).to.equal(getTestData("DiagnosisCreateModel").Interpretation);
                expect(response.body.Data.Diagnosis.OnsetDate).to.equal(getTestData("DiagnosisCreateModel").OnsetDate);
                expect(response.body.Data.Diagnosis.EndDate).to.equal(getTestData("DiagnosisCreateModel").EndDate);

            })
            .expect(201, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadDiagnosisCreateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        MedicalCondition          : null,
        Comments                  : "better than earlier",
        IsClinicallyActive        : false,
        ValidationStatus          : "Confirmed",
        Interpretation            : "Significant change up",
        OnsetDate                 : "2023-09-15T00:00:00.000Z",
        EndDate                   : "2023-09-25T00:00:00.000Z"
  
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
