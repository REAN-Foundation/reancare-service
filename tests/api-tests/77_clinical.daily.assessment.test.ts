import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Daily assessment tests', function() {

    var agent = request.agent(infra._app);

    it('360 - Create daily assessment', function(done) {
        loadDailyAssessmentCreateModel();
        const createModel = getTestData("DailyAssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/daily-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.DailyAssessment.id, 'DailyAssessmentId');
                expect(response.body.Data.DailyAssessment).to.have.property('id');
                expect(response.body.Data.DailyAssessment).to.have.property('PatientUserId');
                expect(response.body.Data.DailyAssessment).to.have.property('Feeling');
                expect(response.body.Data.DailyAssessment).to.have.property('Mood');

                setTestData(response.body.Data.DailyAssessment.id, 'DailyAssessmentId');

                expect(response.body.Data.DailyAssessment.PatientUserId).to.equal(getTestData("DailyAssessmentCreateModel").PatientUserId);
                expect(response.body.Data.DailyAssessment.Feeling).to.equal(getTestData("DailyAssessmentCreateModel").Feeling);
                expect(response.body.Data.DailyAssessment.Mood).to.equal(getTestData("DailyAssessmentCreateModel").Mood);

            })
            .expect(201, done);
    });

    it('361 - Search daily assessment records', function(done) {
        loadDailyAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/daily-assessments/search${loadDailyAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.DailyAssessmentRecords).to.have.property('TotalCount');
                expect(response.body.Data.DailyAssessmentRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.DailyAssessmentRecords).to.have.property('PageIndex');
                expect(response.body.Data.DailyAssessmentRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.DailyAssessmentRecords).to.have.property('Order');
                expect(response.body.Data.DailyAssessmentRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.DailyAssessmentRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.DailyAssessmentRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadDailyAssessmentCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Feeling       : "Worst",
        Mood          : "Stressed",
        EnergyLevels  : [
            "Eat",
            "Get off the bed"
        ]
  
    };
    setTestData(model, "DailyAssessmentCreateModel");
};

function loadDailyAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?mood=Stressed';
    return queryString;
}
