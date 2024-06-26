import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe.skip('68 - Patient tests', function () {
    var agent = request.agent(infra._app);

    it('68:01 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneThirdModel();
        const createModel = getTestData('patientCreateWithPhoneThirdModel');
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

    it('68:02 -> Patient login with password', function (done) {
        loadPatientLoginThirdModel();
        const createModel = getTestData('patientLoginThirdModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'patientJwt_1');
                setTestData(response.body.Data.User.UserId, 'patientUserId_5');
            })
            .expect(200, done);
    });

    it('68:03 -> Update patient', function (done) {
        loadPatientUpdateModel();
        const updateModel = getTestData('patientUpdateModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('68:04 -> Get available care plans', function (done) {
        loadCareplanQueryString();
        agent
            .get(`/api/v1/care-plans${loadCareplanQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('68:05 -> Get Careplan Eligibilty', function (done) {
        agent
            .get(
                `/api/v1/care-plans/eligibility/${getTestData('patientUserId')}/providers/AHA/careplans/${getTestData(
                    'CAREPALNCODE'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Eligibility).to.have.property('Eligible');
                expect(response.body.Data.Eligibility.Eligible).to.equal(true);
            })
            .expect(200, done);
    });

    it('68:06 -> Enroll to careplan', function (done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData('enrollmentCreateModel');
        agent
            .post(`/api/v1/care-plans/patients/${getTestData('patientUserId_5')}/enroll`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Enrollment.id, 'enrollmentId');
                expect(response.body.Data.Enrollment).to.have.property('Provider');
                expect(response.body.Data.Enrollment).to.have.property('PlanCode');
                expect(response.body.Data.Enrollment).to.have.property('StartAt');

                expect(response.body.Data.Enrollment.Provider).to.equal(getTestData('enrollmentCreateModel').Provider);
                expect(response.body.Data.Enrollment.PlanCode).to.equal(getTestData('enrollmentCreateModel').PlanCode);
            })
            .expect(201, done);
    });

    it('68:07 -> Get all careplan enrollments for patient', function (done) {
        agent
            .get(`/api/v1/care-plans/patients/${getTestData('patientUserId')}/enrollments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('68:08 -> Negative - Update patient', function (done) {
        loadPatientUpdateModel();
        const updateModel = getTestData('patientUpdateModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('68:09 -> Negative - Get Careplan Eligibilty', function (done) {
        agent
            .get(
                `/api/v1/care-plans/eligibility/${getTestData('patientUserId')}/providers/AHA/careplans/${getTestData(
                    'CARE'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('68:10 -> Negative - Enroll to careplan', function (done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData('enrollmentCreateModel');
        agent
            .post(`/api/v1/care-plans/patients/${getTestData('patientUserId')}/enroll`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

const patientPhoneNumber: string = faker.phone.number();

const patientPassword: string = faker.internet.password();

export const loadPatientCreateWithPhoneThirdModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
    };
    setTestData(model, 'patientCreateWithPhoneThirdModel');
};

export const loadPatientLoginThirdModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
    };
    setTestData(model, 'patientLoginThirdModel');
};

export const loadPatientUpdateModel = async () => {
    const model = {
        Prefix: faker.person.prefix(),
        FirstName: faker.person.firstName(),
        MiddleName: faker.person.middleName(),
        LastName: faker.person.lastName(),
        Email: faker.internet.email(),
        Gender: faker.person.gender(),
        BirthDate: faker.date.birthdate(),
        ImageResourceId: faker.string.uuid(),
        Address: {
            Type: faker.lorem.word(),
            AddressLine: faker.location.streetAddress(),
            City: faker.location.city(),
            Country: faker.location.country(),
        },
        DefaultTimeZone: '+05:30',
        CurrentTimeZone: '+05:30',
    };
    setTestData(model, 'patientUpdateModel');
};

function loadCareplanQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadEnrollmentCreateModel = async () => {
    const model = {
        Provider: 'AHA',
        PlanCode: 'HFMotivator',
        StartDate: '2024-08-17',
    };
    setTestData(model, 'enrollmentCreateModel');
};
