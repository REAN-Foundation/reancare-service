import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Person-Organization tests', function() {

    var agent = request.agent(infra._app);

    it('14 - Negative - Create person-organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId1')}/add-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(422, done);
    });

    it('15 - Negative - Get organization by Personid', function(done) {
        agent
            .get(`/api/v1/persons/${getTestData('DoctorPersonId')}/organizations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(401, done);
    });

    it('16 - Negative - Get Person for Organization', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/persons`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(403, done);
    });

    it('17 - Negative - Removal person from organization', function(done) {
     
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
