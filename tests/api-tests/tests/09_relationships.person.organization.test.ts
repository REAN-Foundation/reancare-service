import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';

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

    it('09:03 -> Get Person for Organization', function(done) {
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

    it('09:04 -> set contact user to organization', function(done) {
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

    it('09:05 -> Removal person from organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('09:06 -> Negative - Create person-organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(403, done);
    });

    it('09:07 -> Negative - Get organization by Personid', function(done) {
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

    it('09:08 -> Negative - Get Person for Organization', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/persons`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(401, done);
    });

    it('09:09 -> Negative - Removal person from organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPersonOrganizationUpdateModel = async (
) => {
    const model = {
        ContactUserId : getTestData('PatientUserId')
    };
    setTestData(model, "PersonOrganizationUpdateModel");
};
