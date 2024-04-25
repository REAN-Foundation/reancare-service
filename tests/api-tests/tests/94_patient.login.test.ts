import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('94 - Patient tests', function () {
    var agent = request.agent(infra._app);

    it('94:01 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneFirstModel();
        const createModel = getTestData('PatientCreateWithPhoneFirstModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Patient.User.id, 'PatientUserId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('94:02 -> Patient login with password', function (done) {
        loadPatientLoginFirstModel();
        const createModel = getTestData('PatientLoginFirstModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'PatientJwt');
                setTestData(response.body.Data.User.id, 'PatientUserId_01');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

const firstPatientPhoneNumber: string = faker.phone.number();

const secondPatientPhoneNumber: string = faker.phone.number();

const patientPassword: string = faker.internet.password();

export const loadPatientPhoneCreateFirstModel = async () => {
    const model = {
        Phone: faker.phone.number(),
        TenantId: getTestData('TenantId'),
    };
    setTestData(model, 'PatientPhoneCreateFirstModel');
};

export const loadPatientLoginFirstModel = async () => {
    const model = {
        Phone: secondPatientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('TenantId'),
    };
    setTestData(model, 'PatientLoginFirstModel');
};

export const loadPatientCreateWithPhoneFirstModel = async () => {
    const model = {
        Phone: secondPatientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('TenantId'),
    };
    setTestData(model, 'PatientCreateWithPhoneFirstModel');
};

export const loadPatientCreateFirstModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstPatientPhoneNumber,
        TenantId: getTestData('TenantId'),
    };
    setTestData(model, 'PatientCreateFirstModel');
};

export const loadPatientFailCreateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstPatientPhoneNumber,
    };
    setTestData(model, 'PatientFailCreateModel');
};

export const loadPatientUpdateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'PatientUpdateModel');
};

export const loadAddressUpdateModel = async () => {
    const model = {
        Prefix: faker.person.prefix(),
        FirstName: faker.person.firstName(),
        MiddleName: faker.person.middleName(),
        LastName: faker.person.lastName(),
        Email: faker.internet.exampleEmail(),
        Gender: faker.person.gender(),
        BirthDate: faker.setDefaultRefDate(new Date('1991-01-01')),
        ImageResourceId: faker.string.uuid(),
        Addresses: [
            {
                Type: faker.lorem.word(),
                AddressLine: faker.location.streetAddress(),
                City: faker.location.city(),
                District: faker.lorem.word(),
                State: faker.location.state(),
                Country: faker.location.country(),
                PostalCode: faker.location.zipCode(),
                Longitude: faker.location.longitude(),
                Lattitude: faker.location.latitude(),
            },
        ],
    };
    setTestData(model, 'AddressUpdateModel');
};

function loadPatientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
