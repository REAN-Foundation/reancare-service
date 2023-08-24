import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Calorie balance records tests', function() {

    var agent = request.agent(infra._app);

    it('158 - Create calorie balance', function(done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData("CalorieBalanceCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId');
                expect(response.body.Data.CalorieBalance).to.have.property('id');
                expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
                expect(response.body.Data.CalorieBalance).to.have.property('Unit');
        
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId');

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData("CalorieBalanceCreateModel").PatientUserId);
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesConsumed);
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesBurned);
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData("CalorieBalanceCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('159 - Get calorie balance by id', function(done) {
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.CalorieBalance).to.have.property('id');
                expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
                expect(response.body.Data.CalorieBalance).to.have.property('Unit');

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData("CalorieBalanceCreateModel").PatientUserId);
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesConsumed);
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesBurned);
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData("CalorieBalanceCreateModel").Unit);
            })
            .expect(200, done);
    });

    it('160 - Search calorie balance records', function(done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.CalorieBalanceRecords).to.have.property('TotalCount');
                expect(response.body.Data.CalorieBalanceRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.CalorieBalanceRecords).to.have.property('PageIndex');
                expect(response.body.Data.CalorieBalanceRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.CalorieBalanceRecords).to.have.property('Order');
                expect(response.body.Data.CalorieBalanceRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.CalorieBalanceRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.CalorieBalanceRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('161 - Update calorie balance', function(done) {
        loadCalorieBalanceUpdateModel();
        const updateModel = getTestData("CalorieBalanceUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.CalorieBalance).to.have.property('id');
                expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
                expect(response.body.Data.CalorieBalance).to.have.property('Unit');

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData("CalorieBalanceUpdateModel").PatientUserId);
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(getTestData("CalorieBalanceUpdateModel").CaloriesConsumed);
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(getTestData("CalorieBalanceUpdateModel").CaloriesBurned);
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData("CalorieBalanceUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('162 - Delete calorie balance', function(done) {
        
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create calorie balance again', function(done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData("CalorieBalanceCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId');
                expect(response.body.Data.CalorieBalance).to.have.property('id');
                expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
                expect(response.body.Data.CalorieBalance).to.have.property('Unit');
        
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId');

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData("CalorieBalanceCreateModel").PatientUserId);
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesConsumed);
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesBurned);
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData("CalorieBalanceCreateModel").Unit);

            })
            .expect(201, done);
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
