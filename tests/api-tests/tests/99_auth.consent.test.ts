import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, pastDateString, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('99 - Consent tests', function () {
    var agent = request.agent(infra._app);

    it('99:01 -> Create consent', function (done) {
        loadConsentCreateModel();
        const createModel = getTestData('consentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setConsentId(response, 'consentId_1');
                expectConsentProperties(response);

                expectConsentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('99:02 -> Get consent by id', function (done) {
        agent
            .get(`/api/v1/consents/${getTestData('consentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectConsentProperties(response);

                expectConsentPropertyValues(response);
            })
            .expect(200, done);
    });

    it('99:03 -> Search consent records', function (done) {
        loadConsentQueryString();
        agent
            .get(`/api/v1/consents/search${loadConsentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Consents).to.have.property('TotalCount');
                expect(response.body.Data.Consents).to.have.property('RetrievedCount');
                expect(response.body.Data.Consents).to.have.property('PageIndex');
                expect(response.body.Data.Consents).to.have.property('ItemsPerPage');
                expect(response.body.Data.Consents).to.have.property('Order');
                expect(response.body.Data.Consents.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Consents.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Consents.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('99:04 -> Update consent', function (done) {
        loadConsentUpdateModel();
        const updateModel = getTestData('consentUpdateModel');
        agent
            .put(`/api/v1/consents/${getTestData('consentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectConsentProperties(response);

                expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(
                    getTestData('consentUpdateModel').AllResourcesInCategory
                );
                expect(response.body.Data.Consent.TenantOwnedResource).to.equal(
                    getTestData('consentUpdateModel').TenantOwnedResource
                );
                expect(response.body.Data.Consent.Perpetual).to.equal(getTestData('consentUpdateModel').Perpetual);
            })
            .expect(200, done);
    });

    it('99:05 -> Delete consent', function (done) {
        agent
            .delete(`/api/v1/consents/${getTestData('consentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create consent again', function (done) {
        loadConsentCreateModel();
        const createModel = getTestData('consentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setConsentId(response, 'consentId');
                expectConsentProperties(response);

                expectConsentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('99:06 -> Negative - Create consent', function (done) {
        loadNegativeConsentCreateModel();
        const createModel = getTestData('negativeConsentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('99:07 -> Negative - Get consent by id', function (done) {
        agent
            .get(`/api/v1/consents/${getTestData('consentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('99:08 -> Negative - Update consent', function (done) {
        loadConsentUpdateModel();
        const updateModel = getTestData('consentUpdateModel');
        agent
            .put(`/api/v1/consents/${getTestData('consentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setConsentId(response, key) {
    setTestData(response.body.Data.Consent.id, key);
}

function expectConsentProperties(response) {
    expect(response.body.Data.Consent).to.have.property('ResourceId');
    expect(response.body.Data.Consent).to.have.property('TenantId');
    expect(response.body.Data.Consent).to.have.property('ResourceCategory');
    expect(response.body.Data.Consent).to.have.property('ResourceName');
    expect(response.body.Data.Consent).to.have.property('ConsentHolderUserId');
    expect(response.body.Data.Consent).to.have.property('AllResourcesInCategory');
    expect(response.body.Data.Consent).to.have.property('TenantOwnedResource');
    expect(response.body.Data.Consent).to.have.property('Perpetual');
    expect(response.body.Data.Consent).to.have.property('RevokedTimestamp');
    expect(response.body.Data.Consent).to.have.property('ConsentGivenOn');
    expect(response.body.Data.Consent).to.have.property('ConsentValidFrom');
    expect(response.body.Data.Consent).to.have.property('ConsentValidTill');
}

function expectConsentPropertyValues(response) {
    expect(response.body.Data.Consent.ResourceId).to.equal(getTestData('consentCreateModel').ResourceId);
    expect(response.body.Data.Consent.TenantId).to.equal(getTestData('consentCreateModel').TenantId);
    expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData('consentCreateModel').ResourceCategory);
    expect(response.body.Data.Consent.ResourceName).to.equal(getTestData('consentCreateModel').ResourceName);
    expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData('consentCreateModel').ConsentHolderUserId);
    expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(
        getTestData('consentCreateModel').AllResourcesInCategory
    );
    expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData('consentCreateModel').TenantOwnedResource);
    expect(response.body.Data.Consent.Perpetual).to.equal(getTestData('consentCreateModel').Perpetual);
}

export const loadConsentCreateModel = async () => {
    const model = {
        ResourceId: getTestData('patientUserId'),
        TenantId: getTestData('tenantId'),
        ResourceCategory: faker.lorem.word(),
        ResourceName: faker.lorem.word(),
        ConsentHolderUserId: faker.string.uuid(),
        AllResourcesInCategory: faker.datatype.boolean(),
        TenantOwnedResource: faker.datatype.boolean(),
        Perpetual: faker.datatype.boolean(),
        RevokedTimestamp: startDate,
        ConsentGivenOn: faker.date.anytime(),
        ConsentValidFrom: startDate,
        ConsentValidTill: endDate,
    };
    setTestData(model, 'consentCreateModel');
};

export const loadConsentUpdateModel = async () => {
    const model = {
        AllResourcesInCategory: faker.datatype.boolean(),
        TenantOwnedResource: faker.datatype.boolean(),
        Perpetual: faker.datatype.boolean(),
    };
    setTestData(model, 'consentUpdateModel');
};

function loadConsentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeConsentCreateModel = async () => {
    const model = {
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativeConsentCreateModel');
};
