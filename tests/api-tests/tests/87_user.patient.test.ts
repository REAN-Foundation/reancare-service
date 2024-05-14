import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { GenderList } from '../../../src/domain.types/miscellaneous/system.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('87 - Second user logs in tests', function () {
    var agent = request.agent(infra._app);

    it('87:01 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneFourthModel();
        const createModel = getTestData('patientCreateWithPhoneFourthModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Patient.User.id, 'patientUserId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('87:02 -> Second user logs in', function (done) {
        loadPatientLoginFourthModel();
        const PatientLoginModel = getTestData('patientLoginFourthModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientLoginModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'patientJwt_2');
                setTestData(response.body.Data.User.id, 'patientUserId_11');
            })
            .expect(200, done);
    });

    it('87:03 -> Update user details', function (done) {
        loadUserDetailsUpdateModel();
        const updateModel = getTestData('userDetailsUpdateModel');
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

    it('87:04 -> Negative - Create patient with phone & password', function (done) {
        loadNPatientPasswordPhoneCreateModel();
        const createModel = getTestData('negativePatientPasswordPhoneCreateModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('87:05 -> Negative - Second user logs in', function (done) {
        const PatientLoginModel = getTestData('patientLoginModel4');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .send(PatientLoginModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('87:06 -> Negative - Update user details', function (done) {
        loadNUserDetailsUpdateModel();
        const updateModel = getTestData('negativeUserDetailsUpdateModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(updateModel)
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

export const loadPatientCreateWithPhoneFourthModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientCreateWithPhoneFourthModel');
};

export const loadPatientLoginFourthModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientLoginFourthModel');
};

export const loadUserDetailsUpdateModel = async () => {
    const model = {
        Prefix: faker.person.prefix(),
        FirstName: faker.person.firstName(),
        MiddleName: faker.person.middleName(),
        LastName: faker.person.lastName(),
        Email: faker.internet.email(),
        Gender: getRandomEnumValue(GenderList),
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
    setTestData(model, 'userDetailsUpdateModel');
};

export const loadNPatientPasswordPhoneCreateModel = async () => {
    const model = {};
    setTestData(model, 'negativePatientPasswordPhoneCreateModel');
};

export const loadNUserDetailsUpdateModel = async () => {
    const model = {};
    setTestData(model, 'negativeUserDetailsUpdateModel');
};
