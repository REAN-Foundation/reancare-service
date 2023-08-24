import request from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Api client tests', function () {
    var agent = request.agent(infra._app);

    it('3 - Create api client', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('ApiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientCreateModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(201, done);
    });

    it('4 - Create api client - with validity period', function (done) {
        loadApiClientTimeCreateModel();
        const createModel = getTestData('ApiClientTimeCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientTimeId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientTimeId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientTimeCreateModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientTimeCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientTimeCreateModel').Email);
                
            })
            .expect(201, done);
    });

    it('5 - Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientCreateModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(200, done);
    });

    it('6 - Get current api key', function(done) {

        agent
            .get(`/api/v1/api-clients/${getTestData('ClientCode')}/current-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `New-Client-Test@123`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('7 - Renew api key', function (done) {
        loadApiKeyUpdateModel();
        const updateModel = getTestData('ApiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `New-Client-Test@123`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('8 - Search api client records', function(done) {
        loadApiClientQueryString();
        agent
            .get(`/api/v1/api-clients/search${loadApiClientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.ApiClientRecords).to.have.property('TotalCount');
                expect(response.body.Data.ApiClientRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.ApiClientRecords).to.have.property('PageIndex');
                expect(response.body.Data.ApiClientRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.ApiClientRecords).to.have.property('Order');
                expect(response.body.Data.ApiClientRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.ApiClientRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.ApiClientRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('9 - Update api client', function (done) {
        loadApiClientUpdateModel();
        const updateModel = getTestData('ApiClientUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientUpdateModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientUpdateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientUpdateModel').Email);
            })
            .expect(200, done);
    });

    it('10 - Delete api client', function (done) {

        agent
            .delete(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create api client again', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('ApiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientCreateModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadApiClientCreateModel = async () => {
    const model = {
        ClientName : 'Rean Bot Wrapper',
        Password   : 'New-Client-Test@123',
        Phone      : '+91 9876543219',
        Email      : 'dev@excell-medicos.com',
    };
    setTestData(model, 'ApiClientCreateModel');
};

export const loadApiClientTimeCreateModel = async () => {
    const model = {
        ClientName : 'Excellent Medicos',
        Password   : 'New-Client-Test@123',
        Phone      : '+91 9876543217',
        Email      : 'dev@excell-medicos.com',
        ValidFrom  : "2021-07-21",
        ValidTill  : "2024-07-20"
    };
    setTestData(model, 'ApiClientTimeCreateModel');
};

export const loadApiKeyUpdateModel = async () => {
    const model = {
        ValidFrom : "2023-07-21",
        ValidTill : "2024-07-20"
    };
    setTestData(model, 'ApiKeyUpdateModel');
};

export const loadApiClientUpdateModel = async () => {
    const model = {
        ClientName : 'Rean Bot Wrapper',
        Phone      : '+91 9876543219',
        Email      : 'dev@excell-medicos.com',
    };
    setTestData(model, 'ApiClientUpdateModel');
};

function loadApiClientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientName=Rean Bot Wrapper';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
