import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('15 - Reminder type tests', function() {

    var agent = request.agent(infra._app);

    it('15:01 -> Get reminder types', function(done) {
        agent
            .get(`/api/v1/types/reminder-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('15:02 -> Get repeat for every n types', function(done) {
        agent
            .get(`/api/v1/types/reminder-repeat-after-every-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('15:03 -> Negative - Get reminder types', function(done) {
        agent
            .get(`/api/v1/types/reminder-types/`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('15:04 -> Negative - Get repeat for every n types', function(done) {
        agent
            .get(`/api/v1/types/reminder-repeat-after-every-units/`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////
