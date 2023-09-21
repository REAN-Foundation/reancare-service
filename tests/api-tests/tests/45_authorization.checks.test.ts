import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('45 - Authorization checks tests', function() {

    var agent = request.agent(infra._app);

    it('45:01 -> Add blood pressure record for first patient', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('45:02 -> Create patient with phone & password', function(done) {
        loadPatientCreateWithPhoneSecondModel();
        const createModel = getTestData("PatientCreateWithPhoneSecondModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('45:03 -> Patient login with password', function(done) {
        loadPatientLoginSecondModel();
        const createModel = getTestData("PatientLoginSecondModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt_2");
                setTestData(response.body.Data.User.UserId, "PatientUserId_2");

            })
            .expect(200, done);
    });
  
    it('45:04 -> Second patient tries to get blood pressure of first', function(done) {
   
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('45:05 -> Second patient tries to update blood pressure of first', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureUpdateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('45:06 -> Second patient tries to delete blood pressure of first', function(done) {

        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId_1');
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId_1');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });
  
    it('45:07 -> Negative - Second patient tries to get blood pressure of first', function(done) {
   
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('45:08 -> Negative - Second patient tries to update blood pressure of first', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('45:09 -> Negative - Second patient tries to delete blood pressure of first', function(done) {

        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
    
});

///////////////////////////////////////////////////////////////////////////

const patientPhoneNumber: string = faker.phone.number('+91-##########');

const patientPassword : string = faker.internet.password()

export const loadPatientCreateWithPhoneSecondModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
        };
        setTestData(model, 'PatientCreateWithPhoneSecondModel');
};

export const loadPatientLoginSecondModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
        };
        setTestData(model, 'PatientLoginSecondModel');
};

export const loadBloodPressureCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : faker.number.int({ min: 100, max: 150 }),
        Diastolic        : faker.number.int({ min: 100, max: 150 }),
        Unit             : faker.string.symbol(),
        RecordDate       : faker.date.anytime(),
        RecordedByUserId : getTestData("PatientUserId")
  
    };
    setTestData(model, "BloodPressureCreateModel");
};

export const loadBloodPressureUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : faker.number.int({ min: 100, max: 150 }),
        Diastolic        : faker.number.int({ min: 100, max: 150 }),
        Unit             : faker.string.symbol(),
        RecordDate       : faker.date.anytime(),
        RecordedByUserId : getTestData("PatientUserId")
    
    };
    setTestData(model, "BloodPressureUpdateModel");
};

