import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { FoodConsumptionEvents } from '../../../src/domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('30 - Nutrition food consumption tests', function() {

    var agent = request.agent(infra._app);

    it('30:01 -> Create food consumption', function(done) {
        loadFoodCreateModel();
        const createModel = getTestData("FoodCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.FoodConsumption.id, 'FoodId_1');
                expect(response.body.Data.FoodConsumption).to.have.property('id');
                expect(response.body.Data.FoodConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.FoodConsumption).to.have.property('Food');
                expect(response.body.Data.FoodConsumption).to.have.property('Description');
                expect(response.body.Data.FoodConsumption).to.have.property('ConsumedAs');
                expect(response.body.Data.FoodConsumption).to.have.property('Calories');
                expect(response.body.Data.FoodConsumption).to.have.property('StartTime');
                expect(response.body.Data.FoodConsumption).to.have.property('EndTime');

                setTestData(response.body.Data.FoodConsumption.id, 'FoodId_1');

                expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(getTestData("FoodCreateModel").PatientUserId);
                expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData("FoodCreateModel").Food);
                expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData("FoodCreateModel").Description);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);

            })
            .expect(201, done);
    });

    it('30:02 -> Get food consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.FoodConsumption).to.have.property('id');
                expect(response.body.Data.FoodConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.FoodConsumption).to.have.property('Food');
                expect(response.body.Data.FoodConsumption).to.have.property('Description');
                expect(response.body.Data.FoodConsumption).to.have.property('ConsumedAs');
                expect(response.body.Data.FoodConsumption).to.have.property('Calories');
                expect(response.body.Data.FoodConsumption).to.have.property('StartTime');
                expect(response.body.Data.FoodConsumption).to.have.property('EndTime');

                expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(getTestData("FoodCreateModel").PatientUserId);
                expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData("FoodCreateModel").Food);
                expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData("FoodCreateModel").Description);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);
                
            })
            .expect(200, done);
    });

    it('30:03 -> Get food consumption by event name', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('30:04 -> Get food consumption by record for day', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}/for-day/2021-09-16`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('30:05 -> Search food consumption records', function(done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('30:06 -> Update food consumption', function(done) {
        loadFoodUpdateModel();
        const updateModel = getTestData("FoodUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.FoodConsumption).to.have.property('id');
                expect(response.body.Data.FoodConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.FoodConsumption).to.have.property('Food');
                expect(response.body.Data.FoodConsumption).to.have.property('Description');
                expect(response.body.Data.FoodConsumption).to.have.property('ConsumedAs');
                expect(response.body.Data.FoodConsumption).to.have.property('Calories');
                expect(response.body.Data.FoodConsumption).to.have.property('StartTime');
                expect(response.body.Data.FoodConsumption).to.have.property('EndTime');

                expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(getTestData("FoodUpdateModel").PatientUserId);
                expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData("FoodUpdateModel").Food);
                expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData("FoodUpdateModel").Description);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodUpdateModel").Calories);

            })
            .expect(200, done);
    });

    it('30:07 -> Delete food consumption', function(done) {
       
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create food consumption again', function(done) {
        loadFoodCreateModel();
        const createModel = getTestData("FoodCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.FoodConsumption.id, 'FoodId');
                expect(response.body.Data.FoodConsumption).to.have.property('id');
                expect(response.body.Data.FoodConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.FoodConsumption).to.have.property('Food');
                expect(response.body.Data.FoodConsumption).to.have.property('Description');
                expect(response.body.Data.FoodConsumption).to.have.property('ConsumedAs');
                expect(response.body.Data.FoodConsumption).to.have.property('Calories');
                expect(response.body.Data.FoodConsumption).to.have.property('StartTime');
                expect(response.body.Data.FoodConsumption).to.have.property('EndTime');

                setTestData(response.body.Data.FoodConsumption.id, 'FoodId');

                expect(response.body.Data.FoodConsumption.PatientUserId).to.equal(getTestData("FoodCreateModel").PatientUserId);
                expect(response.body.Data.FoodConsumption.Food).to.equal(getTestData("FoodCreateModel").Food);
                expect(response.body.Data.FoodConsumption.Description).to.equal(getTestData("FoodCreateModel").Description);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);

            })
            .expect(201, done);
    });

    it('30:08 -> Negative - Create food consumption', function(done) {
        loadFoodCreateModel();
        const createModel = getTestData("FoodCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('30:09 -> Negative - Get food consumption by event name', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('30:10 -> Negative - Search food consumption records', function(done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('30:11 -> Negative - Delete food consumption', function(done) {
       
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId_1')}`)
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

export const loadFoodCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : faker.lorem.word(),
        Description   : faker.word.words(),
        ConsumedAs    : getRandomEnumValue(FoodConsumptionEvents),
        Calories      : faker.number.int(500),
        StartTime     : startDate,
        EndTime       : endDate
  
    };
    setTestData(model, "FoodCreateModel");
};

export const loadFoodUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : faker.lorem.word(),
        Description   : faker.word.words(),
        ConsumedAs    : getRandomEnumValue(FoodConsumptionEvents),
        Calories      : faker.number.int(500),
        StartTime     : startDate,
        EndTime       : endDate
    
    };
    setTestData(model, "FoodUpdateModel");
};

function loadFoodQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
