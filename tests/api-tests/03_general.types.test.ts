import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('03 - Type tests', function() {

    var agent = request.agent(infra._app);

    it('03 - 01 - Get person role', function(done) {
        agent
            .get(`/api/v1/types/person-roles/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03 - 02 - Get organization types', function(done) {
        agent
            .get(`/api/v1/types/organization-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03 - 03 - Get gender types', function(done) {
        agent
            .get(`/api/v1/types/genders/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03 - 01 - Negative - Get person role', function(done) {
        agent
            .get(`/api/v1/types/person-roles/`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('03 - 02 - Negative - Get gender types', function(done) {
        agent
            .get(`/api/v1/types/genders/`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////
