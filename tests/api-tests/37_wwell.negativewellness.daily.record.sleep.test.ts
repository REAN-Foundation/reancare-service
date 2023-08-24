import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Sleep record tests', function() {

    var agent = request.agent(infra._app);

    it('94 - Negative - Create sleep', function(done) {
        loadSleepCreateModel();
        const createModel = getTestData("Sleep");
        agent
            .post(`/api/v1/wellness/daily-records/sleep/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('95 - Negative - Search sleep records', function(done) {
        loadSleepQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/sleep/search${loadSleepQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('96 - Negative - Delete sleep', function(done) {
      
        agent
            .delete(`/api/v1/wellness/daily-records/sleep/${getTestData('Sleep')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadSleepCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        SleepDuration : 8,
        Unit          : "1",
        RecordDate    : "2023-09-15T00:00:00.000Z"
  
    };
    setTestData(model, "SleepCreateModel");
};

export const loadSleepUpdateModel = async (
) => {
    const model = {
        SleepDuration : 10,
        Unit          : "10",
    };
    setTestData(model, "SleepUpdateModel");
};

function loadSleepQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?sleepDuration=8';
    return queryString;
}
