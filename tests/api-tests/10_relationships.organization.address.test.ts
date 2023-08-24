import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Organization-address tests', function() {

    var agent = request.agent(infra._app);

    it('54 - Create organization address', function(done) {
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/add-address/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
    it('55 - Get address by organization id', function(done) {
        agent
            .get(`/api/v1/organizations/${getTestData('OrganizationId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
    
    it('56 - Removal an address from organization', function(done) {
        
        agent
            .post(`/api/v1/organizations/${getTestData('OrganizationId')}/remove-address/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

});
///////////////////////////////////////////////////////////////////////////
