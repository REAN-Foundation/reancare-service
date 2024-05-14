import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('102 - tests', function () {
    var agent = request.agent(infra._app);

    it('102:01 -> Create tenants test', function (done) {
        loadTenantCreateModel();
        const createModel = getTestData('tenantCreateModel');
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('102:02 -> Create api client test', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('apiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('102:03 -> Get patient stats', function (done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('102:04 -> Create donation test', function (done) {
        loadDonationCreateModel();
        const createModel = getTestData('donationCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('102:05 -> Create task', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadTenantCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Description: faker.lorem.words(),
        Code: faker.lorem.word(),
        // Phone: faker.phone.number(),
        Phone: '+91-1450000011',
        Email: faker.internet.email(),
    };
    setTestData(model, 'tenantCreateModel');
};

export const loadApiClientCreateModel = async () => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        // Phone: faker.phone.number(),
        Phone: '+91-1000000011',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'apiClientCreateModel');
};

export const loadDonationCreateModel = async () => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        // Phone: faker.phone.number(),
        Phone: '+91-1220000001',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'donationCreateModel');
};

export const loadTaskCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Task: faker.lorem.word(),
        Category: 'Custom',
        ActionType: 'Medication',
        ActionId: faker.string.uuid(),
        ScheduledStartTime: startDate,
        ScheduledEndTime: endDate,
        IsRecurrent: false,
    };
    setTestData(model, 'taskCreateModel');
};
