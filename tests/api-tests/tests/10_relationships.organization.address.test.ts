import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData } from '../init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('10 - Organization-address tests', function () {
    var agent = request.agent(infra._app);

    it('10:01 -> Create organization address', function (done) {
        agent
            .post(`/api/v1/organizations/${getTestData('organizationId')}/add-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('10:02 -> Get address by organization id', function (done) {
        agent
            .get(`/api/v1/organizations/${getTestData('organizationId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('10:03 -> Removal an address from organization', function (done) {
        agent
            .post(`/api/v1/organizations/${getTestData('organizationId')}/remove-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('10:04 -> Negative - Create organization address', function (done) {
        agent
            .post(`/api/v1/organizations/${getTestData('organizationId')}/add-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('10:05 -> Negative - Get address by organization id', function (done) {
        agent
            .get(`/api/v1/organizations/${getTestData('organizationId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('10:06 -> Negative - Removal an address from organization', function (done) {
        agent
            .post(`/api/v1/organizations/${getTestData('organizationId')}/remove-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////
