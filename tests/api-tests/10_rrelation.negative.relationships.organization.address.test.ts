import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Organization-address tests', function() {

    var agent = request.agent(infra._app);

    it('18 - Negative - Create organization address', function(done) {
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-address/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });
    it('19 - Negative - Get address by organization id', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId1')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });
    
    it('20 - Negative - Removal an address from organization', function(done) {
        
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-address/${getTestData('AddressId')}`)
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
