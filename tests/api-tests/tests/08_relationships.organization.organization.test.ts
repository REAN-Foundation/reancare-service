import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('08 - Organization-organization tests', function() {

    var agent = request.agent(infra._app);

    it('08:01 -> Set parent organization', function(done) {
        loadOrganizationRelationUpdateModel();
        const updateModel = getTestData("Organization_OragnizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactUserId');
                expect(response.body.Data.Organization).to.have.property('ContactUser');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('ParentOrganizationId');

                expect(response.body.Data.Organization.ParentOrganization).to.have.property('Name');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('Type');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('ContactUserId');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('About');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('ParentOrganizationId');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('ImageResourceId');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('IsHealthFacility');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('NationalHealthFacilityRegistryId');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('CreatedAt');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('UpdatedAt');
                expect(response.body.Data.Organization.ParentOrganization).to.have.property('DeletedAt');
                expect(response.body.Data.Organization).to.have.property('About');
                expect(response.body.Data.Organization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization).to.have.property('Addresses');
                expect(response.body.Data.Organization).to.have.property('ImageResourceId');
                expect(response.body.Data.Organization).to.have.property('IsHealthFacility');
                expect(response.body.Data.Organization).to.have.property('NationalHealthFacilityRegistryId');

            })
            .expect(200, done);
    });

    it('08:02 -> Negative - Set parent organization', function(done) {
        loadOrganizationRelationUpdateModel();
        const updateModel = getTestData("Organization_OragnizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId')}`)
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

export const loadOrganizationRelationUpdateModel = async (
) => {
    const model = {
        ParentOrganizationId : getTestData('OrganizationId'),
    };
    setTestData(model, "Organization_OragnizationUpdateModel");
};
