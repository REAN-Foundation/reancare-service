import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('34 - Calorie balance records tests', function () {
    var agent = request.agent(infra._app);

    it('34:01 -> Create calorie balance', function (done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData('calorieBalanceCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCalorieBalanceId(response, 'calorieBalanceId_1');
                expectCalorieBalanceProperties(response);

                expectCalorieBalancePropertyValues(response);
            })
            .expect(201, done);
    });

    it('34:02 -> Get calorie balance by id', function (done) {
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('calorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectCalorieBalanceProperties(response);

                expectCalorieBalancePropertyValues(response);
            })
            .expect(200, done);
    });

    it('34:03 -> Search calorie balance records', function (done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('34:04 -> Update calorie balance', function (done) {
        loadCalorieBalanceUpdateModel();
        const updateModel = getTestData('calorieBalanceUpdateModel');
        agent
            .put(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('calorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectCalorieBalanceProperties(response);

                expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(
                    getTestData('calorieBalanceUpdateModel').PatientUserId
                );
                expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(
                    getTestData('calorieBalanceUpdateModel').CaloriesConsumed
                );
                expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(
                    getTestData('calorieBalanceUpdateModel').CaloriesBurned
                );
                expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData('calorieBalanceUpdateModel').Unit);
            })
            .expect(200, done);
    });

    it('34:05 -> Delete calorie balance', function (done) {
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('calorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create calorie balance again', function (done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData('calorieBalanceCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCalorieBalanceId(response, 'calorieBalanceId');
                expectCalorieBalanceProperties(response);

                expectCalorieBalancePropertyValues(response);
            })
            .expect(201, done);
    });

    it('34:06 -> Negative - Create calorie balance', function (done) {
        loadCalorieBalanceCreateModel();
        const createModel = getTestData('calorieBalanceCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/calorie-balances/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('34:07 -> Negative - Search calorie balance records', function (done) {
        loadCalorieBalanceQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/calorie-balances/search${loadCalorieBalanceQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('34:08 -> Negative - Delete calorie balance', function (done) {
        agent
            .delete(`/api/v1/wellness/daily-records/calorie-balances/${getTestData('calorieBalanceId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setCalorieBalanceId(response, key) {
    setTestData(response.body.Data.CalorieBalance.id, key);
}

function expectCalorieBalanceProperties(response) {
    expect(response.body.Data.CalorieBalance).to.have.property('id');
    expect(response.body.Data.CalorieBalance).to.have.property('PatientUserId');
    expect(response.body.Data.CalorieBalance).to.have.property('CaloriesConsumed');
    expect(response.body.Data.CalorieBalance).to.have.property('CaloriesBurned');
    expect(response.body.Data.CalorieBalance).to.have.property('Unit');
}

function expectCalorieBalancePropertyValues(response) {
    expect(response.body.Data.CalorieBalance.PatientUserId).to.equal(getTestData('calorieBalanceCreateModel').PatientUserId);
    expect(response.body.Data.CalorieBalance.CaloriesConsumed).to.equal(
        getTestData('calorieBalanceCreateModel').CaloriesConsumed
    );
    expect(response.body.Data.CalorieBalance.CaloriesBurned).to.equal(
        getTestData('calorieBalanceCreateModel').CaloriesBurned
    );
    expect(response.body.Data.CalorieBalance.Unit).to.equal(getTestData('calorieBalanceCreateModel').Unit);
}

export const loadCalorieBalanceCreateModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
        PatientUserId: getTestData('patientUserId'),
        CaloriesConsumed: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        CaloriesBurned: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'calorieBalanceCreateModel');
};

export const loadCalorieBalanceUpdateModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
        PatientUserId: getTestData('patientUserId'),
        CaloriesConsumed: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        CaloriesBurned: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'calorieBalanceUpdateModel');
};

function loadCalorieBalanceQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
