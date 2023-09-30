import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { faker } from '@faker-js/faker';
import { getTestData, setTestData } from '../init';
import { OrganizationTypes } from '../../../src/domain.types/general/organization/organization.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('06 - Organization tests', function() {

    var agent = request.agent(infra._app);

    it('06:01 -> Create organization', function(done) {
        loadOrganizationCreateModel();
        const createModel = getTestData("OrganizationCreateModel");
        agent
            .post(`/api/v1/organizations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Organization.id, 'OrganizationId_1');
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('About');
                expect(response.body.Data.Organization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization).to.have.property('ImageResourceId');
                expect(response.body.Data.Organization).to.have.property('IsHealthFacility');

                setTestData(response.body.Data.Organization.id, 'OrganizationId_1');

                expect(response.body.Data.Organization.Type).to.equal(getTestData("OrganizationCreateModel").Type);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(201, done);
    });

    it('06:02 -> Get organization by id', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('About');
                expect(response.body.Data.Organization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization).to.have.property('ImageResourceId');
                expect(response.body.Data.Organization).to.have.property('IsHealthFacility');

                expect(response.body.Data.Organization.Type).to.equal(getTestData("OrganizationCreateModel").Type);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(200, done);
    });

    it('06:03 -> Search organization records', function(done) {
        loadOrganizationQueryString();
        agent
            .get(`/api/v1/organizations/search${loadOrganizationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Organizations).to.have.property('TotalCount');
                expect(response.body.Data.Organizations).to.have.property('RetrievedCount');
                expect(response.body.Data.Organizations).to.have.property('PageIndex');
                expect(response.body.Data.Organizations).to.have.property('ItemsPerPage');
                expect(response.body.Data.Organizations).to.have.property('Order');
                expect(response.body.Data.Organizations.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Organizations.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Organizations.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('06:04 -> Update organization', function(done) {
        loadOrganizationUpdateModel();
        const updateModel = getTestData("OrganizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('About');
                expect(response.body.Data.Organization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization).to.have.property('ImageResourceId');

                expect(response.body.Data.Organization.Type).to.equal(getTestData("OrganizationUpdateModel").Type);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationUpdateModel").ContactPhone);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationUpdateModel").About);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationUpdateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationUpdateModel").IsHealthFacility);

            })
            .expect(200, done);
    });

    it('06:05 -> Delete organization', function(done) {
        
        agent
            .delete(`/api/v1/organizations/${getTestData('OrganizationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create organization again', function(done) {
        loadOrganizationCreateModel();
        const createModel = getTestData("OrganizationCreateModel");
        agent
            .post(`/api/v1/organizations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Organization.id, 'OrganizationId');
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('About');
                expect(response.body.Data.Organization).to.have.property('OperationalSince');
                expect(response.body.Data.Organization).to.have.property('ImageResourceId');
                expect(response.body.Data.Organization).to.have.property('IsHealthFacility');

                setTestData(response.body.Data.Organization.id, 'OrganizationId');

                expect(response.body.Data.Organization.Type).to.equal(getTestData("OrganizationCreateModel").Type);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(201, done);
    });

    it('06:06 -> Negative - Create organization', function(done) {
        loadNegativeOrganizationCreateModel();
        const createModel = getTestData("NegativeOrganizationCreateModel");
        agent
            .post(`/api/v1/organizations/`)
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

    it('06:07 -> Negative - Search organization records', function(done) {
        loadOrganizationQueryString();
        agent
            .get(`/api/v1/organizations/search${loadOrganizationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('06:08 -> Negative - Delete organization', function(done) {
        
        agent
            .delete(`/api/v1/organizations/${getTestData('OrganizationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadOrganizationCreateModel = async (   
) => {
    const model = {
        Type             : getRandomEnumValue(OrganizationTypes),
        Name             : faker.person.fullName(),
        ContactPhone     : faker.phone.number('+91-##########'),
        ContactEmail     : faker.internet.exampleEmail(),
        About            : faker.word.words(5),
        OperationalSince : faker.date.past(),
        ImageResourceId  : faker.string.uuid(),
        IsHealthFacility : faker.datatype.boolean()
    
    };
    setTestData(model, "OrganizationCreateModel");
};

export const loadOrganizationUpdateModel = async (
) => {
    const model = {
        Type             : getRandomEnumValue(OrganizationTypes),
        Name             : faker.person.fullName(),
        ContactPhone     : faker.phone.number('+91-##########'),
        ContactEmail     : faker.internet.exampleEmail(),
        About            : faker.word.words(5),
        OperationalSince : faker.date.past(),
        ImageResourceId  : faker.string.uuid(),
        IsHealthFacility : faker.datatype.boolean()
    };
    setTestData(model, "OrganizationUpdateModel");
};

function loadOrganizationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeOrganizationCreateModel = async (   
) => {
    const model = {
        ImageResourceId  : faker.string.uuid(),
        IsHealthFacility : faker.datatype.boolean()
    };
    setTestData(model, "NegativeOrganizationCreateModel");
};

///////////////////////////////////////////////////////////////////////////

