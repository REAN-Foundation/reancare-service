import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Person-Organization tests', function() {

    var agent = request.agent(infra._app);

    it('49 - Create person-organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('50 - Get organization by Personid', function(done) {
        agent
            .get(`/api/v1/persons/${getTestData('DoctorPersonId')}/organizations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('51 - Get Person for Organization', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/persons`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('52 - set contact user to organization', function(done) {
        loadPersonOrganizationUpdateModel();
        const updateModel = getTestData("PersonOrganizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('OrganizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('53 - Removal person from organization', function(done) {
     
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-person/${getTestData('DoctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
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
