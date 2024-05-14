import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { futureDateString, pastDateString } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('03 - Api client tests', function () {
    var agent = request.agent(infra._app);

    it('03:01 -> Create api client', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('apiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setClientId(response, 'apiClientId');
                setClientCodeId(response, 'ClientCode');
                expectClientProperties(response);

                expect(response.body.Data.Client.Phone).to.equal(getTestData('apiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('apiClientCreateModel').Email);
            })
            .expect(201, done);
    });

    it('03:02 -> Create api client - with validity period', function (done) {
        loadApiClientValidityCreateModel();
        const createModel = getTestData('apiClientValidityCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setClientId(response, 'apiClientTimeId');
                setClientCodeId(response, 'ClientCode');
                expectClientProperties(response);

            })
            .expect(201, done);
    });

    it('03:03 -> Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('apiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expectClientProperties(response);

                expectClientPropertyValues(response);
            })
            .expect(200, done);
    });

    it('03:04 -> Get current api key', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ClientCode')}/current-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData('ClientCode')}`, `${process.env.TEST_CLIENT_PASSWORD}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03:05 -> Renew api key', function (done) {
        loadApiKeyUpdateModel();
        const updateModel = getTestData('apiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData('ClientCode')}`, `${process.env.TEST_CLIENT_PASSWORD}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03:06 -> Search api client records', function (done) {
        loadApiClientQueryString();
        agent
            .get(`/api/v1/api-clients/search${loadApiClientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body.Data.ClientAppRecords).to.have.property('TotalCount');
                expect(response.body.Data.ClientAppRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.ClientAppRecords).to.have.property('PageIndex');
                expect(response.body.Data.ClientAppRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.ClientAppRecords).to.have.property('Order');
                expect(response.body.Data.ClientAppRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.ClientAppRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.ClientAppRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('03:07 -> Update api client', function (done) {
        loadApiClientUpdateModel();
        const updateModel = getTestData('apiClientUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('apiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expectClientProperties(response);

                expect(response.body.Data.Client.Phone).to.equal(getTestData('apiClientUpdateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('apiClientUpdateModel').Email);
            })
            .expect(200, done);
    });

    it('03:08 -> Delete api client', function (done) {
        agent
            .delete(`/api/v1/api-clients/${getTestData('apiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create api client again', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('apiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                setClientId(response, 'apiClientId');
                setClientCodeId(response, 'ClientCode');
                expectClientProperties(response);

                expectClientPropertyValues(response);
            })
            .expect(201, done);
    });

    it('03:09 -> Negative - Create api client', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('apiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('03:10 -> Negative - Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('apiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('03:11 -> Negative - Renew api key', function (done) {
        loadNegativeApiKeyUpdateModel();
        const updateModel = getTestData('apiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData('ClientCode')}`, `xyz`)
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('03:12 -> Negative - Delete api client', function (done) {
        agent
            .delete(`/api/v1/api-clients/${getTestData('apiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setClientId(response, key) {
    setTestData(response.body.Data.Client.id, key);
}

function setClientCodeId(response, key) {
    setTestData(response.body.Data.Client.ClientCode, key);
}

function expectClientProperties(response) {
    expect(response.body.Data.Client).to.have.property('id');
    expect(response.body.Data.Client).to.have.property('ClientName');
    expect(response.body.Data.Client).to.have.property('Phone');
    expect(response.body.Data.Client).to.have.property('Email');
}

function expectClientPropertyValues(response) {
    expect(response.body.Data.Client.Phone).to.equal(getTestData('apiClientCreateModel').Phone);
    expect(response.body.Data.Client.Email).to.equal(getTestData('apiClientCreateModel').Email);
}

export const loadApiClientCreateModel = async () => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        // Phone: faker.phone.number(),
        Phone: '+91-1000000001',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'apiClientCreateModel');
};

export const loadApiClientValidityCreateModel = async () => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        // Phone: faker.phone.number(),
        Phone: '+91-1000000001',
        Email: faker.internet.exampleEmail(),
        ValidFrom: pastDateString,
        ValidTill: futureDateString,
    };
    setTestData(model, 'apiClientValidityCreateModel');
};

export const loadApiKeyUpdateModel = async () => {
    const model = {
        ValidFrom: pastDateString,
        ValidTill: futureDateString,
    };
    setTestData(model, 'apiKeyUpdateModel');
};

export const loadApiClientUpdateModel = async () => {
    const model = {
        ClientName: faker.person.fullName(),
        // Phone: faker.phone.number(),
        Phone: '+91-1000000001',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'apiClientUpdateModel');
};

export const loadNegativeApiKeyUpdateModel = async () => {
    const model = {};
    setTestData(model, 'apiKeyUpdateModel');
};

function loadApiClientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
