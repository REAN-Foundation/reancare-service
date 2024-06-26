import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('04 - Patient tests', function () {
    var agent = request.agent(infra._app);

    it('04:01 -> Get user roles', function (done) {
        agent
            .get(`/api/v1/types/person-roles`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04:02 -> Register patient- with only a phone number', function (done) {
        loadPatientPhoneCreateFirstModel();
        const createModel = getTestData('patientPhoneCreateFirstModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Patient.id, 'patientPhoneId');
                setTestData(response.body.Data.Patient.User.id, 'patientUserPhoneId');
                setTestData(response.body.Data.Patient.User.Person.id, 'patientPersonPhoneId');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Patient.id, 'patientPhoneId');

                expect(response.body.Data.Patient.User.Person.Phone).to.equal(
                    getTestData('patientPhoneCreateFirstModel').Phone
                );
            })
            .expect(201, done);
    });

    it('Create patient', function (done) {
        loadPatientCreateFirstModel();
        const createModel = getTestData('PatientCreateFirstModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setPatientId(response, 'PatientId');
                setPatientUserId(response, 'PatientUserId_2');
                setPatientPersonId(response, 'PatientPersonId_1');
                expectPatientProperties(response);

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(
                    getTestData('PatientCreateFirstModel').FirstName
                );
            })
            .expect(201, done);
    });

    // it('04:03 -> Get user with phone and role', function (done) {
    //     agent
    //         .get(`/api/v1/users/by-phone/${firstPatientPhoneNumber}/role/${getTestData('patientRoleId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('04:04 -> Register patient- with same phone number - should fail', function (done) {
        loadPatientFailCreateModel();
        const createModel = getTestData('patientFailCreateModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(409, done);
    });

    it('04:05 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneFirstModel();
        const createModel = getTestData('patientCreateWithPhoneFirstModel');
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

    it('04:06 -> Patient login with password', function (done) {
        loadPatientLoginFirstModel();
        const createModel = getTestData('patientLoginFirstModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'patientJwt');
                setTestData(response.body.Data.User.id, 'patientUserId');
                setTestData(response.body.Data.User.Person.id, 'patientPersonId');
            })
            .expect(200, done);
    });

    it('04:03 -> Get user with phone and role', function (done) {
        agent
            .get(`/api/v1/users/by-phone/${firstPatientPhoneNumber}/role/${getTestData('patientRoleId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04:07 -> Get patient by id', function (done) {
        agent
            .get(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04:08 -> Search patient records', function (done) {
        loadPatientQueryString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Patients).to.have.property('TotalCount');
                expect(response.body.Data.Patients).to.have.property('RetrievedCount');
                expect(response.body.Data.Patients).to.have.property('PageIndex');
                expect(response.body.Data.Patients).to.have.property('ItemsPerPage');
                expect(response.body.Data.Patients).to.have.property('Order');
                expect(response.body.Data.Patients.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Patients.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Patients.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('04:09 -> Update patient', function (done) {
        loadPatientUpdateModel();
        const updateModel = getTestData('patientUpdateModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectPatientProperties(response);

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(
                    getTestData('patientUpdateModel').FirstName
                );
            })
            .expect(200, done);
    });
    it('04:10 -> Update patient EMRId', function (done) {
        loadPatientUpdateEMRIdModel();
        const updateModel = getTestData('patientUpdateEMRIdModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.Patient.User.Person).to.have.property('id');
                expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Patient.User.Person).to.have.property('Email');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');
                expect(response.body.Data.Patient).to.have.property('ExternalMedicalRegistrationId');
                expect(response.body.Data.Patient.ExternalMedicalRegistrationId).to.equal(
                    getTestData('patientUpdateEMRIdModel').ExternalMedicalRegistrationId
                );
            })
            .expect(200, done);
    });
    
    it('04:11 -> Search patient EMRId records', function (done) {
        loadPatientQueryEMRIdString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryEMRIdString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Patients).to.have.property('TotalCount');
                expect(response.body.Data.Patients).to.have.property('RetrievedCount');
                expect(response.body.Data.Patients).to.have.property('PageIndex');
                expect(response.body.Data.Patients).to.have.property('ItemsPerPage');
                expect(response.body.Data.Patients).to.have.property('Order');
                expect(response.body.Data.Patients.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Patients.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Patients.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('04:12 -> Update patient details - partial address', function (done) {
        loadAddressUpdateModel();
        const updateModel = getTestData('addressUpdateModel');
        agent
            .put(`/api/v1/patients/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setPatientId(response, key) {
    setTestData(response.body.Data.Patient.id, key);
}

function setPatientUserId(response, key) {
    setTestData(response.body.Data.Patient.User.id, key);
}

function setPatientPersonId(response, key) {
    setTestData(response.body.Data.Patient.User.Person.id, key);
}

function expectPatientProperties(response) {
    expect(response.body.Data.Patient.User.Person).to.have.property('id');
    expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
    expect(response.body.Data.Patient.User.Person).to.have.property('Email');
    expect(response.body.Data.Patient.User.Person).to.have.property('Phone');
}

// const firstPatientPhoneNumber: string = faker.phone.number();

const firstPatientPhoneNumber: string = '+91-1000000002';

// const secondPatientPhoneNumber: string = faker.phone.number();

const secondPatientPhoneNumber: string = '+91-1000000003';

const patientPassword: string = faker.internet.password();

export const loadPatientPhoneCreateFirstModel = async () => {
    const model = {
        // Phone: faker.phone.number(),
        Phone: '+91-1000000010',
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientPhoneCreateFirstModel');
};

export const loadPatientLoginFirstModel = async () => {
    const model = {
        Phone: secondPatientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientLoginFirstModel');
};

export const loadPatientCreateWithPhoneFirstModel = async () => {
    const model = {
        Phone: secondPatientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientCreateWithPhoneFirstModel');
};

export const loadPatientCreateFirstModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstPatientPhoneNumber,
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'PatientCreateFirstModel');
};

export const loadPatientFailCreateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstPatientPhoneNumber,
    };
    setTestData(model, 'patientFailCreateModel');
};

export const loadPatientUpdateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'patientUpdateModel');
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
    setTestData(model, 'addressUpdateModel');
};

export const loadPatientGetModel = async () => {
    const model = {
        Phone: secondPatientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientLoginFirstModel');
};

function loadPatientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadPatientUpdateEMRIdModel = async () => {
    const model = {
        ExternalMedicalRegistrationId: "abc123",
      };
    setTestData(model, 'patientUpdateEMRIdModel');
};

function loadPatientQueryEMRIdString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?externalMedicalRegistrationId=abc123';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
