import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { endDate, startDate } from '../utils';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('09 - Person-Organization tests', function() {

    var agent = request.agent(infra._app);

    it('09:01 -> Create person-organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('09:02 -> Get organization by Personid', function(done) {
        agent
            .get(`/api/v1/persons/${getTestData('DoctorPersonId')}/organizations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('09:03 -> Create consent', function(done) {
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

    it('09:04 -> Get Person for Organization', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/persons`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('09:05 -> set contact user to organization', function(done) {
        loadPersonOrganizationUpdateModel();
        const updateModel = getTestData("PersonOrganizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('09:06 -> Removal person from organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('09:07 -> Negative - Create person-organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

    it('09:08 -> Negative - Get organization by Personid', function(done) {
        agent
            .get(`/api/v1/persons/${getTestData('DoctorPersonId')}/organizations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(401, done);
    });

    it('09:09 -> Negative - Get Person for Organization', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/persons`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(401, done);
    });

    it('09:10 -> Negative - Removal person from organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
      ResourceId : getTestData("AdminUserId"),
      TenantId: getTestData("TenantId"),
      ResourceCategory: faker.lorem.word(),
      ResourceName: "General.Organization.GetPersons",
      ConsentHolderUserId    : getTestData("DoctorUserId"),
      AllResourcesInCategory: faker.datatype.boolean(),
      TenantOwnedResource: faker.datatype.boolean(),
      Perpetual: true,
      Revoked: false,
      RevokedTimestamp: startDate,
      ConsentGivenOn: faker.date.anytime(),
      ConsentValidFrom: startDate,
      ConsentValidTill: endDate,

    };
    setTestData(model, "ConsentCreateModel");
};

export const loadPersonOrganizationUpdateModel = async (
) => {
    const model = {
        ContactUserId : getTestData('PatientUserId')
    };
    setTestData(model, "PersonOrganizationUpdateModel");
};
