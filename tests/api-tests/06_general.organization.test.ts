import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Organization tests', function() {

    var agent = request.agent(infra._app);

    it('38 - Create organization', function(done) {
        loadOrganizationCreateModel();
        const createModel = getTestData("OrganizationCreateModel");
        agent
            .post(`/api/v1/organizations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Organization.Name).to.equal(getTestData("OrganizationCreateModel").Name);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.ContactEmail).to.equal(getTestData("OrganizationCreateModel").ContactEmail);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.OperationalSince).to.equal(getTestData("OrganizationCreateModel").OperationalSince);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(201, done);
    });

    it('39 - Get organization by id', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Organization.Name).to.equal(getTestData("OrganizationCreateModel").Name);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.ContactEmail).to.equal(getTestData("OrganizationCreateModel").ContactEmail);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.OperationalSince).to.equal(getTestData("OrganizationCreateModel").OperationalSince);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(200, done);
    });

    it('40 - Search organization records', function(done) {
        loadOrganizationQueryString();
        agent
            .get(`/api/v1/organizations/search${loadOrganizationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('41 - Update organization', function(done) {
        loadOrganizationUpdateModel();
        const updateModel = getTestData("OrganizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Organization.Name).to.equal(getTestData("OrganizationUpdateModel").Name);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationUpdateModel").ContactPhone);
                expect(response.body.Data.Organization.ContactEmail).to.equal(getTestData("OrganizationUpdateModel").ContactEmail);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationUpdateModel").About);
                expect(response.body.Data.Organization.OperationalSince).to.equal(getTestData("OrganizationUpdateModel").OperationalSince);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationUpdateModel").ImageResourceId);

            })
            .expect(200, done);
    });

    it('42 - Delete organization', function(done) {
        
        agent
            .delete(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Organization.Name).to.equal(getTestData("OrganizationCreateModel").Name);
                expect(response.body.Data.Organization.ContactPhone).to.equal(getTestData("OrganizationCreateModel").ContactPhone);
                expect(response.body.Data.Organization.ContactEmail).to.equal(getTestData("OrganizationCreateModel").ContactEmail);
                expect(response.body.Data.Organization.About).to.equal(getTestData("OrganizationCreateModel").About);
                expect(response.body.Data.Organization.OperationalSince).to.equal(getTestData("OrganizationCreateModel").OperationalSince);
                expect(response.body.Data.Organization.ImageResourceId).to.equal(getTestData("OrganizationCreateModel").ImageResourceId);
                expect(response.body.Data.Organization.IsHealthFacility).to.equal(getTestData("OrganizationCreateModel").IsHealthFacility);

            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadOrganizationCreateModel = async (
) => {
    const model = {
        Type             : "Clinic",
        Name             : "Shree Clinic",
        ContactPhone     : "+91-1234567890",
        ContactEmail     : "xyz@gmail.com",
        About            : "Shree Gastroenterology and Endoscopy Clinic",
        OperationalSince : "2017-05-08T00:00:00.000Z",
        ImageResourceId  : "80eb4c8b-f302-4612-9fe9-f832c6eb401f",
        IsHealthFacility : true
    };
    setTestData(model, "OrganizationCreateModel");
};

export const loadOrganizationUpdateModel = async (
) => {
    const model = {
        Type             : "Hospital",
        Name             : "Shree Hospital",
        ContactPhone     : "+91-1234567890",
        ContactEmail     : "xyz@gmail.com",
        About            : "Shree Hospital is a speciality hospital located on western part of the Pune city specializing in post-trauma care",
        OperationalSince : "2017-05-08T00:00:00.000Z",
        ImageResourceId  : "80eb4c8b-f302-4612-9fe9-f832c6eb401f",
    };
    setTestData(model, "OrganizationUpdateModel");
};

function loadOrganizationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?type=Clinic';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
