import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('34 - Calorie balance records tests', function() {

    var agent = request.agent(infra._app);

    it('34:01 -> Create calorie balance', function(done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData("CalorieBalanceCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId_1');
                expect(response.body.Data.CalorieBalance).to.have.property('id');
                expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
                expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
                expect(response.body.Data.CalorieBalance).to.have.property('Unit');
        
                setTestData(response.body.Data.CalorieBalance.id, 'CalorieBalanceId_1');

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData("CalorieBalanceCreateModel").PatientUserId);
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesConsumed);
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(getTestData("CalorieBalanceCreateModel").CaloriesBurned);
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData("CalorieBalanceCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('34:02 -> Get calorie balance by id', function(done) {
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('34:03 -> Search calorie balance records', function(done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('34:04 -> Update calorie balance', function(done) {
        loadCalorieBalanceUpdateModel();
        const updateModel = getTestData("CalorieBalanceUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('34:05 -> Delete calorie balance', function(done) {
        
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('34:06 -> Negative - Create calorie balance', function(done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData("CalorieBalanceCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('34:07 -> Negative - Search calorie balance records', function(done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('34:08 -> Negative - Delete calorie balance', function(done) {
        
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('CalorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
        CaloriesConsumed : faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        CaloriesBurned   : faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        Unit             : faker.string.symbol()
  
    };
    setTestData(model, "CalorieBalanceCreateModel");
};

export const loadCalorieBalanceUpdateModel = async (
) => {
    const model = {
        PersonId         : getTestData("PatientPersonId"),
        PatientUserId    : getTestData("PatientUserId"),
        CaloriesConsumed : faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        CaloriesBurned   : faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        Unit             : faker.string.symbol()
    
    };
    setTestData(model, "CalorieBalanceUpdateModel");
};

function loadCalorieBalanceQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
