import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Calorie balance records tests', function() {

    var agent = request.agent(infra._app);

    it('85 - Negative - Create calorie balance', function(done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData("CalorieBalanceCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('86 - Negative - Search calorie balance records', function(done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('87 - Negative - Delete calorie balance', function(done) {
        
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalance')}`)
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

export const loadCalorieBalanceCreateModel = async (
) => {
    const model = {
        PersonId         : getTestData("PatientPersonId"),
        PatientUserId    : getTestData("PatientUserId"),
        CaloriesConsumed : 3.66,
        CaloriesBurned   : 4.32,
        Unit             : "kcal"
  
    };
    setTestData(model, "CalorieBalanceCreateModel");
};

export const loadCalorieBalanceUpdateModel = async (
) => {
    const model = {
        PersonId         : getTestData("PatientPersonId"),
        PatientUserId    : getTestData("PatientUserId"),
        CaloriesConsumed : 5.66,
        CaloriesBurned   : 6.32,
        Unit             : "kcal"
    
    };
    setTestData(model, "CalorieBalanceUpdateModel");
};

function loadCalorieBalanceQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?minCaloriesConsumedValue=3.66';
    return queryString;
}
