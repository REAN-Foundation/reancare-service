import request from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Api client tests', function () {
    var agent = request.agent(infra._app);

    it('1 - Negative - Create api client', function (done) {
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

    it('2 - Negative - Get api client by id', function (done) {
        agent
            .get(`/api/v1/api-clients/${getTestData('ApiClientId1')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(422, done);
    });

    it('3 - Negative - Renew api key', function (done) {
        loadApiKeyUpdateModel();
        const updateModel = getTestData('ApiKeyUpdateModel');
        agent
            .put(`/api/v1/api-clients/${getTestData('ClientCode')}/renew-api-key`)
            .set('Content-Type', 'application/json')
            .auth(`${getTestData("ClientCode")}`, `New-Client-Test123`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('4 - Negative - Delete api client', function (done) {

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

///////////////////////////////////////////////////////////////////////////
