import request from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
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

                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(201, done);
    });

    it('03:02 -> Create api client - with validity period', function (done) {
        loadApiClientValidityCreateModel();
        const createModel = getTestData('ApiClientValidityCreateModel');
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

                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientValidityCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientValidityCreateModel').Email);
                
            })
            .expect(201, done);
    });

    it('03:03 -> Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ApiClientId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Client).to.have.property('id');
                expect(response.body.Data.Client).to.have.property('ClientName');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(200, done);
    });

    it('03:04 -> Get current api key', function(done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ClientCode')}/current-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `${process.env.TEST_CLIENT_PASSWORD}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('03:05 -> Renew api key', function (done) {
        loadApiKeyUpdateModel();
        const updateModel = getTestData('ApiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `${process.env.TEST_CLIENT_PASSWORD}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03:06 -> Search api client records', function(done) {
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

    it('03:07 -> Update api client', function (done) {
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


                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientUpdateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientUpdateModel').Email);
            })
            .expect(200, done);
    });

    it('03:08 -> Delete api client', function (done) {

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
                setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
                expect(response.body.Data.Client).to.have.property('Phone');
                expect(response.body.Data.Client).to.have.property('Email');

                setTestData(response.body.Data.Client.id, 'ApiClientId');

                expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
                expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
            })
            .expect(201, done);
    });

    it('03:09 -> Negative - Create api client', function (done) {
        loadApiClientCreateModel();
        const createModel = getTestData('ApiClientCreateModel');
        agent
            .post(`/api/v1/api-clients/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('03:10 -> Negative - Get api client by id', function (done) {
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

    it('03:11 -> Negative - Renew api key', function (done) {
        loadNegativeApiKeyUpdateModel();
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

    it('03:12 -> Negative - Delete api client', function (done) {

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

export const loadApiClientCreateModel = async (
) => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        Phone : faker.phone.number('+91-##########'),
        Email: faker.internet.exampleEmail()    
    };
    setTestData(model, 'ApiClientCreateModel');
};
    
export const loadApiClientValidityCreateModel = async (
) => {
    const model = {
        ClientName: faker.person.fullName(),
        Password: `${process.env.TEST_CLIENT_PASSWORD}`,
        Phone : faker.phone.number('+91-##########'),
        Email: faker.internet.exampleEmail(),
        ValidFrom  : pastDateString,
        ValidTill  : futureDateString   
    };
    setTestData(model, 'ApiClientValidityCreateModel');
};

export const loadApiKeyUpdateModel = async (
) => {
    const model = {
        ValidFrom  : pastDateString,
        ValidTill  : futureDateString     
    };
    setTestData(model, 'ApiKeyUpdateModel');
};

export const loadApiClientUpdateModel = async (
) => {
    const model = {
        ClientName: faker.person.fullName(),
        Phone : faker.phone.number('+91-##########'),
        Email: faker.internet.exampleEmail(),  
    };
    setTestData(model, 'ApiClientUpdateModel');
};

export const loadNegativeApiKeyUpdateModel = async (
) => {
    const model = {
    
    };
    setTestData(model, 'ApiKeyUpdateModel');
};

function loadApiClientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
