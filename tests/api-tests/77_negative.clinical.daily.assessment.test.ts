import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Daily assessment tests', function() {

    var agent = request.agent(infra._app);

    it('202 - Negative - Create daily assessment', function(done) {
        loadDailyAssessmentCreateModel();
        const createModel = getTestData("DailyAssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/daily-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('203 - Negative - Search daily assessment records', function(done) {
        loadDailyAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/daily-assessments/search${loadDailyAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadDailyAssessmentCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "DailyAssessmentCreateModel");
};

function loadDailyAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?mood=Stressed';
    return queryString;
}
