import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('05 - Doctor tests', function () {
    var agent = request.agent(infra._app);

    it('05:01 -> Register doctor - with only a phone number', function (done) {
        loadDoctorPhoneCreateModel();
        const createModel = getTestData('doctorPhoneCreateModel');
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Doctor.id, 'doctorPhoneId');
                setTestData(response.body.Data.Doctor.User.id, 'doctorUserPhoneId');
                setTestData(response.body.Data.Doctor.User.Person.id, 'doctorPersonPhoneId');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Doctor.id, 'doctorPhoneId');

                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData('doctorPhoneCreateModel').Phone);
            })
            .expect(201, done);
    });

    it('Create Doctor', function (done) {
        loadDoctorCreateModel();
        const createModel = getTestData('doctorCreateModel');
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setDoctorId(response, 'doctorId');
                setDoctorUserId(response, 'doctorUserId_1');
                setDoctorPersonId(response, 'doctorPersonId_1');
                expectDoctorProperties(response);

                expectDoctorPropertyValues(response);
            })
            .expect(201, done);
    });

    it('05:02 -> Create doctor with phone & password', function (done) {
        loadDoctorCreateWithPhoneModel();
        const createModel = getTestData('doctorCreateWithPhoneModel');
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('05:03 -> Register doctor- with same phone number - should fail', function (done) {
        loadDoctorFailCreateModel();
        const createModel = getTestData('doctorFailCreateModel');
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(409, done);
    });

    it('05:04 -> Doctor login with password', function (done) {
        loadDoctorLoginModel();
        const createModel = getTestData('doctorLoginModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'doctorJwt');
                setTestData(response.body.Data.User.id, 'doctorUserId');
                setTestData(response.body.Data.User.Person.id, 'doctorPersonId');
            })
            .expect(200, done);
    });

    it('05:05 -> Get doctor by id', function (done) {
        agent
            .get(`/api/v1/doctors/${getTestData('doctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expectDoctorProperties(response);
            })
            .expect(200, done);
    });

    it('05:06 -> Search doctor records', function (done) {
        loadDoctorQueryString();
        agent
            .get(`/api/v1/doctors/search${loadDoctorQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Doctors).to.have.property('TotalCount');
                expect(response.body.Data.Doctors).to.have.property('RetrievedCount');
                expect(response.body.Data.Doctors).to.have.property('PageIndex');
                expect(response.body.Data.Doctors).to.have.property('ItemsPerPage');
                expect(response.body.Data.Doctors).to.have.property('Order');
                expect(response.body.Data.Doctors.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Doctors.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Doctors.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('05:07 -> Update doctor', function (done) {
        loadDoctorUpdateModel();
        const updateModel = getTestData('doctorUpdateModel');
        agent
            .put(`/api/v1/doctors/${getTestData('doctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectDoctorProperties(response);

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData('doctorUpdateModel').FirstName);
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setDoctorId(response, key) {
    setTestData(response.body.Data.Doctor.id, key);
}

function setDoctorUserId(response, key) {
    setTestData(response.body.Data.Doctor.User.id, key);
}

function setDoctorPersonId(response, key) {
    setTestData(response.body.Data.Doctor.User.Person.id, key);
}

function expectDoctorProperties(response) {
    expect(response.body.Data.Doctor.User.Person).to.have.property('id');
    expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
    expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
    expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');
}

function expectDoctorPropertyValues(response) {
    expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData('doctorCreateModel').FirstName);
    expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData('doctorCreateModel').Phone);
}

// const firstDoctorPhoneNumber: string = faker.phone.number();

const firstDoctorPhoneNumber: string = '+91-1000000004';

// const secondDoctorPhoneNumber: string = faker.phone.number();

const secondDoctorPhoneNumber: string = '+91-1000000005';

const doctorPassword: string = faker.internet.password();

export const loadDoctorPhoneCreateModel = async () => {
    const model = {
        // Phone: faker.phone.number(),
        Phone: '+91-1000000020',
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'doctorPhoneCreateModel');
};

export const loadDoctorCreateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstDoctorPhoneNumber,
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'doctorCreateModel');
};

export const loadDoctorCreateWithPhoneModel = async () => {
    const model = {
        Phone: secondDoctorPhoneNumber,
        Password: doctorPassword,
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'doctorCreateWithPhoneModel');
};

export const loadDoctorLoginModel = async () => {
    const model = {
        Phone: secondDoctorPhoneNumber,
        Password: doctorPassword,
        LoginRoleId: getTestData('doctorRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'doctorLoginModel');
};

export const loadDoctorFailCreateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        Phone: firstDoctorPhoneNumber,
    };
    setTestData(model, 'doctorFailCreateModel');
};

export const loadDoctorUpdateModel = async () => {
    const model = {
        FirstName: faker.person.firstName(),
        Email: faker.internet.exampleEmail(),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'doctorUpdateModel');
};

function loadDoctorQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
