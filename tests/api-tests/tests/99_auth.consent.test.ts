import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, pastDateString, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('64 - Consent tests', function() {

    var agent = request.agent(infra._app);

    it('64:01 -> Create consent', function(done) {
        loadConsentCreateModel();
        const createModel = getTestData("ConsentCreateModel");
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Consent.id, 'ConsentId_1');
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
               
                setTestData(response.body.Data.Consent.id, 'ConsentId_1');

                expect(response.body.Data.Consent.ResourceId).to.equal(getTestData("ConsentCreateModel").ResourceId);
                expect(response.body.Data.Consent.TenantId).to.equal(getTestData("ConsentCreateModel").TenantId);
                expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData("ConsentCreateModel").ResourceCategory);
                expect(response.body.Data.Consent.ResourceName).to.equal(getTestData("ConsentCreateModel").ResourceName);
                expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData("ConsentCreateModel").ConsentHolderUserId);
                expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(getTestData("ConsentCreateModel").AllResourcesInCategory);
                expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData("ConsentCreateModel").TenantOwnedResource);
                expect(response.body.Data.Consent.Perpetual).to.equal(getTestData("ConsentCreateModel").Perpetual);

            })
            .expect(201, done);
    });

    it('64:02 -> Get consent by id', function(done) {
     
        agent
            .get(`/api/v1/consents/${getTestData('ConsentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

              expect(response.body.Data.Consent.ResourceId).to.equal(getTestData("ConsentCreateModel").ResourceId);
              expect(response.body.Data.Consent.TenantId).to.equal(getTestData("ConsentCreateModel").TenantId);
              expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData("ConsentCreateModel").ResourceCategory);
              expect(response.body.Data.Consent.ResourceName).to.equal(getTestData("ConsentCreateModel").ResourceName);
              expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData("ConsentCreateModel").ConsentHolderUserId);
              expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(getTestData("ConsentCreateModel").AllResourcesInCategory);
              expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData("ConsentCreateModel").TenantOwnedResource);
              expect(response.body.Data.Consent.Perpetual).to.equal(getTestData("ConsentCreateModel").Perpetual);
                
            })
            .expect(200, done);
    });

    it('64:03 -> Search consent records', function(done) {
        loadConsentQueryString();
        agent
            .get(`/api/v1/consents/search${loadConsentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('64:04 -> Update consent', function(done) {
        loadConsentUpdateModel();
        const updateModel = getTestData("PulseUpdateModel");
        agent
            .put(`/api/v1/consents/${getTestData('ConsentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
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

              expect(response.body.Data.Consent.ResourceId).to.equal(getTestData("ConsentCreateModel").ResourceId);
              expect(response.body.Data.Consent.TenantId).to.equal(getTestData("ConsentCreateModel").TenantId);
              expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData("ConsentCreateModel").ResourceCategory);
              expect(response.body.Data.Consent.ResourceName).to.equal(getTestData("ConsentCreateModel").ResourceName);
              expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData("ConsentCreateModel").ConsentHolderUserId);
              expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(getTestData("ConsentCreateModel").AllResourcesInCategory);
              expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData("ConsentCreateModel").TenantOwnedResource);
              expect(response.body.Data.Consent.Perpetual).to.equal(getTestData("ConsentCreateModel").Perpetual);

            })
            .expect(200, done);
    });

    it('64:05 -> Delete consent', function(done) {
        
        agent
            .delete(`/api/v1/consents/${getTestData('ConsentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create consent again', function(done) {
        loadConsentCreateModel();
        const createModel = getTestData("ConsentCreateModel");
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
              setTestData(response.body.Data.Consent.id, 'ConsentId');
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
             
              setTestData(response.body.Data.Consent.id, 'ConsentId');

              expect(response.body.Data.Consent.ResourceId).to.equal(getTestData("ConsentCreateModel").ResourceId);
              expect(response.body.Data.Consent.TenantId).to.equal(getTestData("ConsentCreateModel").TenantId);
              expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData("ConsentCreateModel").ResourceCategory);
              expect(response.body.Data.Consent.ResourceName).to.equal(getTestData("ConsentCreateModel").ResourceName);
              expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData("ConsentCreateModel").ConsentHolderUserId);
              expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(getTestData("ConsentCreateModel").AllResourcesInCategory);
              expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData("ConsentCreateModel").TenantOwnedResource);
              expect(response.body.Data.Consent.Perpetual).to.equal(getTestData("ConsentCreateModel").Perpetual);

            })
            .expect(201, done);
    });

    it('64:06 -> Negative - Create consent', function(done) {
        loadNegativeConsentCreateModel();
        const createModel = getTestData("NegativeConsentCreateModel");
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('64:07 -> Negative - Get consent by id', function(done) {
     
        agent
            .get(`/api/v1/consents/${getTestData('ConsentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('64:08 -> Negative - Update consent', function(done) {
        loadConsentUpdateModel();
        const updateModel = getTestData("ConsentUpdateModel");
        agent
            .put(`/api/v1/consents/${getTestData('ConsentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadConsentCreateModel = async (
) => {
    const model = {
      ResourceId : getTestData("PatientUserId"),
      TenantId: getTestData("TenantId"),
      ResourceCategory: faker.lorem.word(),
      ResourceName: faker.lorem.word(),
      ConsentHolderUserId    : faker.string.uuid(),
      AllResourcesInCategory: faker.datatype.boolean(),
      TenantOwnedResource: faker.datatype.boolean(),
      Perpetual: faker.datatype.boolean(),
      RevokedTimestamp: startDate,
      ConsentGivenOn: faker.date.anytime(),
      ConsentValidFrom: startDate,
      ConsentValidTill: endDate,

    };
    setTestData(model, "ConsentCreateModel");
};

export const loadConsentUpdateModel = async (
) => {
    const model = {
        Pulse      : faker.number.int({ min: 70, max:75 }),
        RecordDate : pastDateString
    };
    setTestData(model, "ConsentUpdateModel");
};

function loadConsentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeConsentCreateModel = async (
) => {
    const model = {
        Unit       : faker.string.symbol(),
        RecordDate : faker.date.anytime() 
    };
    setTestData(model, "NegativeConsentCreateModel");
};
