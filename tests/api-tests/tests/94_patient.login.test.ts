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
        const createModel = getTestData('patientCreateWithPhoneFirstModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Patient.User.id, 'patientUserId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('94:02 -> Patient login with password', function (done) {
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
                setTestData(response.body.Data.User.id, 'patientUserId_01');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

const firstPatientPhoneNumber: string = faker.phone.number();

const secondPatientPhoneNumber: string = faker.phone.number();

const patientPassword: string = faker.internet.password();

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

///////////////////////////////////////////////////////////////////////////
