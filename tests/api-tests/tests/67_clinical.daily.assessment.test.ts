import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import {
    DailyAssessmentEnergyLevels,
    DailyAssessmentFeelings,
    DailyAssessmentMoods,
} from '../../../src/domain.types/clinical/daily.assessment/daily.assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('67 - Daily assessment tests', function () {
    var agent = request.agent(infra._app);

    it('67:01 -> Create daily assessment', function (done) {
        loadDailyAssessmentCreateModel();
        const createModel = getTestData('dailyAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/daily-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.DailyAssessment.id, 'dailyAssessmentId');
                expect(response.body.Data.DailyAssessment).to.have.property('id');
                expect(response.body.Data.DailyAssessment).to.have.property('PatientUserId');
                expect(response.body.Data.DailyAssessment).to.have.property('Feeling');
                expect(response.body.Data.DailyAssessment).to.have.property('Mood');

                expect(response.body.Data.DailyAssessment.PatientUserId).to.equal(
                    getTestData('dailyAssessmentCreateModel').PatientUserId
                );
                expect(response.body.Data.DailyAssessment.Feeling).to.equal(
                    getTestData('dailyAssessmentCreateModel').Feeling
                );
                expect(response.body.Data.DailyAssessment.Mood).to.equal(getTestData('dailyAssessmentCreateModel').Mood);
            })
            .expect(201, done);
    });

    it('67:02 -> Search daily assessment records', function (done) {
        loadDailyAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/daily-assessments/search${loadDailyAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('67:03 -> Negative - Create daily assessment', function (done) {
        loadNegativeDailyAssessmentCreateModel();
        const createModel = getTestData('negativeDailyAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/daily-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('67:04 -> Negative - Search daily assessment records', function (done) {
        loadDailyAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/daily-assessments/search${loadDailyAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadDailyAssessmentCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Feeling: getRandomEnumValue(DailyAssessmentFeelings),
        Mood: getRandomEnumValue(DailyAssessmentMoods),
        EnergyLevels: [getRandomEnumValue(DailyAssessmentEnergyLevels), getRandomEnumValue(DailyAssessmentEnergyLevels)],
    };
    setTestData(model, 'dailyAssessmentCreateModel');
};

function loadDailyAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeDailyAssessmentCreateModel = async () => {
    const model = {
        Feeling: getRandomEnumValue(DailyAssessmentFeelings),
        Mood: getRandomEnumValue(DailyAssessmentMoods),
    };
    setTestData(model, 'negativeDailyAssessmentCreateModel');
};
