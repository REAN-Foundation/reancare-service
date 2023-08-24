import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Export template tests', function() {

    var agent = request.agent(infra._app);

    it('430 - Export template', function(done) {

        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}/export`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Version');
                expect(response.body.Version).to.equal('1.0');

            })
            .expect(200, done);
    });

});
