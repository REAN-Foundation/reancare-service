import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('45 - Authorization checks tests', function () {
    var agent = request.agent(infra._app);

    it('45:01 -> Add blood pressure record for first patient', function (done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData('bloodPressureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodPressureId(response, 'bloodPressureId');
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(201, done);
    });

    it('45:02 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneSecondModel();
        const createModel = getTestData('patientCreateWithPhoneSecondModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('45:03 -> Patient login with password', function (done) {
        loadPatientLoginSecondModel();
        const createModel = getTestData('patientLoginSecondModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'patientJwt_2');
                setTestData(response.body.Data.User.UserId, 'patientUserId_2');
            })
            .expect(200, done);
    });

    it('45:04 -> Second patient tries to get blood pressure of first', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(200, done);
    });

    it('45:05 -> Second patient tries to update blood pressure of first', function (done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData('bloodPressureUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectBloodPressureProperties(response);

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(
                    getTestData('bloodPressureUpdateModel').PatientUserId
                );
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData('bloodPressureUpdateModel').Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(
                    getTestData('bloodPressureUpdateModel').Diastolic
                );
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData('bloodPressureUpdateModel').Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(
                    getTestData('bloodPressureUpdateModel').RecordedByUserId
                );
            })
            .expect(200, done);
    });

    it('45:06 -> Second patient tries to delete blood pressure of first', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Add blood pressure record for first patient again', function (done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData('bloodPressureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodPressureId(response, 'bloodPressureId_1');
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(201, done);
    });

    it('45:07 -> Negative - Second patient tries to get blood pressure of first', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('45:08 -> Negative - Second patient tries to update blood pressure of first', function (done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData('bloodPressureUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('45:09 -> Negative - Second patient tries to delete blood pressure of first', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setBloodPressureId(response, key) {
    setTestData(response.body.Data.BloodPressure.id, key);
}

function expectBloodPressureProperties(response) {
    expect(response.body.Data.BloodPressure).to.have.property('id');
    expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
    expect(response.body.Data.BloodPressure).to.have.property('Systolic');
    expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
    expect(response.body.Data.BloodPressure).to.have.property('Unit');
    expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
    expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');
}

function expectBloodPressurePropertyValues(response) {
    expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData('bloodPressureCreateModel').PatientUserId);
    expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData('bloodPressureCreateModel').Systolic);
    expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData('bloodPressureCreateModel').Diastolic);
    expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData('bloodPressureCreateModel').Unit);
    expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(
        getTestData('bloodPressureCreateModel').RecordedByUserId
    );
}

const patientPhoneNumber: string = faker.phone.number();

const patientPassword: string = faker.internet.password();

export const loadPatientCreateWithPhoneSecondModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientCreateWithPhoneSecondModel');
};

export const loadPatientLoginSecondModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientLoginSecondModel');
};

export const loadBloodPressureCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Systolic: faker.number.int({ min: 100, max: 150 }),
        Diastolic: faker.number.int({ min: 100, max: 150 }),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodPressureCreateModel');
};

export const loadBloodPressureUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Systolic: faker.number.int({ min: 100, max: 150 }),
        Diastolic: faker.number.int({ min: 100, max: 150 }),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodPressureUpdateModel');
};
