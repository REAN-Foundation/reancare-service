import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { FoodConsumptionEvents } from '../../../src/domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('30 - Nutrition food consumption tests', function () {
    var agent = request.agent(infra._app);

    it('30:01 -> Create food consumption', function (done) {
        loadFoodCreateModel();
        const createModel = getTestData('foodCreateModel');
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setFoodConsumptionId(response, 'foodId_1');
                expectFoodConsumptionProperties(response);

                expectFoodConsumptionPropertyValues(response);
            })
            .expect(201, done);
    });

    it('30:02 -> Get food consumption by id', function (done) {
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('foodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectFoodConsumptionProperties(response);

                expectFoodConsumptionPropertyValues(response);
            })
            .expect(200, done);
    });

    it('30:03 -> Get food consumption by event name', function (done) {
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('patientUserId')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('30:04 -> Get nutrition questionnaire', function (done) {
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/questionnaire`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('30:05 -> Get food consumption by record for day', function (done) {
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('patientUserId')}/for-day/2021-09-16`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('30:06 -> Search food consumption records', function (done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.FoodConsumptionRecords).to.have.property('TotalCount');
                expect(response.body.Data.FoodConsumptionRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.FoodConsumptionRecords).to.have.property('PageIndex');
                expect(response.body.Data.FoodConsumptionRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.FoodConsumptionRecords).to.have.property('Order');
                expect(response.body.Data.FoodConsumptionRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.FoodConsumptionRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.FoodConsumptionRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('30:07 -> Update food consumption', function (done) {
        loadFoodUpdateModel();
        const updateModel = getTestData('foodUpdateModel');
        agent
            .put(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('foodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectFoodConsumptionProperties(response);

                expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(
                    getTestData('foodUpdateModel').PatientUserId
                );
                expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData('foodUpdateModel').Food);
                expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData('foodUpdateModel').Description);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData('foodUpdateModel').Calories);
            })
            .expect(200, done);
    });

    it('30:08 -> Delete food consumption', function (done) {
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('foodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create food consumption again', function (done) {
        loadFoodCreateModel();
        const createModel = getTestData('foodCreateModel');
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setFoodConsumptionId(response, 'foodId');
                expectFoodConsumptionProperties(response);

                expectFoodConsumptionPropertyValues(response);
            })
            .expect(201, done);
    });

    it('30:09 -> Negative - Create food consumption', function (done) {
        loadFoodCreateModel();
        const createModel = getTestData('foodCreateModel');
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('30:10 -> Negative - Get food consumption by event name', function (done) {
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('foodId')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('30:11 -> Negative - Search food consumption records', function (done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

    it('30:12 -> Negative - Delete food consumption', function (done) {
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('foodId_1')}`)
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

function setFoodConsumptionId(response, key) {
    setTestData(response.body.Data.FoodConsumption.id, key);
}

function expectFoodConsumptionProperties(response) {
    expect(response.body.Data.FoodConsumption).to.have.property('id');
    expect(response.body.Data.FoodConsumption).to.have.property('PatientUserId');
    expect(response.body.Data.FoodConsumption).to.have.property('Food');
    expect(response.body.Data.FoodConsumption).to.have.property('Description');
    expect(response.body.Data.FoodConsumption).to.have.property('ConsumedAs');
    expect(response.body.Data.FoodConsumption).to.have.property('Calories');
    expect(response.body.Data.FoodConsumption).to.have.property('StartTime');
    expect(response.body.Data.FoodConsumption).to.have.property('EndTime');
}

function expectFoodConsumptionPropertyValues(response) {
    expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(getTestData('foodCreateModel').PatientUserId);
    expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData('foodCreateModel').Food);
    expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData('foodCreateModel').Description);
    expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData('foodCreateModel').Calories);
}

export const loadFoodCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Food: faker.lorem.word(),
        Description: faker.word.words(),
        ConsumedAs: getRandomEnumValue(FoodConsumptionEvents),
        Calories: faker.number.int(500),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'foodCreateModel');
};

export const loadFoodUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Food: faker.lorem.word(),
        Description: faker.word.words(),
        ConsumedAs: getRandomEnumValue(FoodConsumptionEvents),
        Calories: faker.number.int(500),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'foodUpdateModel');
};

function loadFoodQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
