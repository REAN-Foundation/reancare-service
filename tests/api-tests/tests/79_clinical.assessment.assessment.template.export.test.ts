import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData } from '../init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('79 - Export template tests', function() {

    var agent = request.agent(infra._app);

    it('79:01 -> Export template', function(done) {

        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}/export`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Version');
                expect(response.body.Version).to.equal('1.0');

            })
            .expect(200, done);
    });

    it('79:02 - Negative - Export template', function(done) {

        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}/export`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});
