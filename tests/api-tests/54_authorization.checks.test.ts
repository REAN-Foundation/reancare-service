import  request  from 'supertest';
import { expect, assert } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Authorization checks tests', function() {

    var agent = request.agent(infra._app);

    it('221 - Add blood pressure record for first patient', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureCreateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('222 - Create patient with phone & password', function(done) {
        loadPatientPasswordPhoneCreateModel();
        const createModel = getTestData("PatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('223 - Patient login with password', function(done) {

        const PatientLoginModel2 = getTestData("PatientLoginModel2");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(PatientLoginModel2)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt_2");
                setTestData(response.body.Data.User.UserId, "PatientUserId_2");

            })
            .expect(200, done);
    });
  
    it('224 - Second patient tries to get blood pressure of first', function(done) {
   
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .expect(response => {
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureCreateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('225 - Second patient tries to update blood pressure of first', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureUpdateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureUpdateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureUpdateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureUpdateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureUpdateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureUpdateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('226 - Second patient tries to delete blood pressure of first', function(done) {

        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Add blood pressure record for first patient again', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureCreateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadBloodPressureCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : 160,
        Diastolic        : 180,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-22T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
  
    };
    setTestData(model, "BloodPressureCreateModel");
};

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-7349901969",
        Password : "Test@123"
      
    };
    setTestData(model, "PatientPasswordPhoneCreateModel");
};

export const loadBloodPressureUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : 100,
        Diastolic        : 80,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-22T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
    
    };
    setTestData(model, "BloodPressureUpdateModel");
};

