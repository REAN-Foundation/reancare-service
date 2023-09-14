import request from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('02 - Api client tests', function () {
    var agent = request.agent(infra._app);

    it('02 - 01 - Create api client', function (done) {
        const ApiClientModel = getTestData('ApiClientModel');
        ApiClientModel.Password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(ApiClientModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientModel').Email);
            })
            .expect(201, done);
    });

    it('02 - 02 - Create api client - with validity period', function (done) {

        const ApiClientTimeModel = getTestData('ApiClientTimeModel');
        ApiClientTimeModel.Password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(ApiClientTimeModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientTimeId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientTimeId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientTimeModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientTimeModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientTimeModel').Email);
                
            })
            .expect(201, done);
    });

    it('02 - 03 - Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientModel').Email);
            })
            .expect(200, done);
    });

    it('02 - 04 - Get current api key', function(done) {
        const password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .get(`/api/v1/api-clients/${getTestData('ClientCode')}/current-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, password)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('02 - 05 - Renew api key', function (done) {
        const ApiKeyUpdateModel = getTestData('ApiKeyUpdateModel');
        const password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, password)
            .send(ApiKeyUpdateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('02 - 06 - Search api client records', function(done) {
        loadApiClientQueryString();
        agent
            .get(`/api/v1/api-clients/search${loadApiClientQueryString()}`)
            .set('Content-Type', 'application/json')
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

    it('02 - 07 - Update api client', function (done) {
        const ApiClientUpdateModel = getTestData('ApiClientUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(ApiClientUpdateModel)
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

    it('02 - 08 - Delete api client', function (done) {

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
        const ApiClientModel = getTestData('ApiClientModel');
        ApiClientModel.Password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(ApiClientModel)
            .expect((response) => {
                setTestData(response.body.Data.Client.id, 'ApiClientId');
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientId');

                expect(response.body.Data.Client.ClientName).to.equal(getTestData('ApiClientModel').ClientName);
                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientModel').Email);
            })
            .expect(201, done);
    });

    it('02 - 01 - Negative - Create api client', function (done) {
        const ApiClientModel = getTestData('ApiClientModel');
        ApiClientModel.Password = process.env.TEST_CLIENT_PASSWORD;
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .send(ApiClientModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('02 - 02 - Negative - Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(403, done);
    });

    it('02 - 03 - Negative - Renew api key', function (done) {
        loadApiKeyUpdateModel();
        const updateModel = getTestData('ApiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `xyz`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('02 - 04 - Negative - Delete api client', function (done) {

        agent
            .delete(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });
    
});

///////////////////////////////////////////////////////////////////////////

export const loadApiKeyUpdateModel = async (
) => {
    const model = {
    
    };
    setTestData(model, 'ApiKeyUpdateModel');
};

function loadApiClientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientName=Rean Bot Wrapper';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
