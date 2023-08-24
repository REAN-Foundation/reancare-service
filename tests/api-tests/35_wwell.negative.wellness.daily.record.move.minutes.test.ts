import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Move minutes records tests', function() {

    var agent = request.agent(infra._app);

    it('88 - Negative - Create move minutes', function(done) {
        loadMoveMinuteCreateModel();
        const createModel = getTestData("MoveMinute");
        agent
            .post(`/api/v1/wellness/daily-records/move-minutes/`)
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

    it('89 - Negative - Search move minutes records', function(done) {
        loadMoveMinuteQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/search${loadMoveMinuteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('90 - Negative - Delete move minutes', function(done) {
       
        agent
            .delete(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinute')}`)
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

export const loadMoveMinuteCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        MoveMinutes   : 50,
        Unit          : "mins",
        RecordDate    : "2021-09-15T00:00:00.000Z"
  
    };
    setTestData(model, "MoveMinuteCreateModel");
};

export const loadMoveMinuteUpdateModel = async (
) => {
    const model = {
        MoveMinutes : 85,
        Unit        : "mins",
        RecordDate  : "2021-09-14T00:00:00.000Z"
    };
    setTestData(model, "MoveMinuteUpdateModel");
};

function loadMoveMinuteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?moveMinutes=50';
    return queryString;
}
