import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('91 - Tenant tests', function () {
    var agent = request.agent(infra._app);

    it('91:01 -> Get Tenant settings types', function (done) {
        agent
            .get(`/api/v1/tenant-settings/types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('91:02 -> Get Tenant settings by type', function (done) {
        agent
            .get(`/api/v1/tenant-settings/${getTestData('tenantId')}/types/Common`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('91:03 -> Get Tenant settings', function (done) {
        agent
            .get(`/api/v1/tenant-settings/${getTestData('tenantId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('91:04 -> Update Tenant settings by type', function (done) {
    //     agent
    //         .put(`/api/v1/tenant-settings/${getTestData('tenantId')}/types/Common`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('91:05 -> Update Tenant settings', function (done) {
    //     agent
    //         .put(`/api/v1/tenant-settings/${getTestData('tenantId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });
});

///////////////////////////////////////////////////////////////////////////
