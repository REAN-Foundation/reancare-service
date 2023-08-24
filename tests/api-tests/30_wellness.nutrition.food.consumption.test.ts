import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Nutrition food consumption tests', function() {

    var agent = request.agent(infra._app);

    it('136 - Create food consumption', function(done) {
        loadFoodCreateModel();
        const createModel = getTestData("FoodCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.FoodConsumption.ConsumedAs).to.equal(getTestData("FoodCreateModel").ConsumedAs);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);
                expect(response.body.Data.FoodConsumption.StartTime).to.equal(getTestData("FoodCreateModel").StartTime);
                expect(response.body.Data.FoodConsumption.EndTime).to.equal(getTestData("FoodCreateModel").EndTime);

            })
            .expect(201, done);
    });

    it('137 - Get food consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.FoodConsumption.ConsumedAs).to.equal(getTestData("FoodCreateModel").ConsumedAs);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);
                expect(response.body.Data.FoodConsumption.StartTime).to.equal(getTestData("FoodCreateModel").StartTime);
                expect(response.body.Data.FoodConsumption.EndTime).to.equal(getTestData("FoodCreateModel").EndTime);
            })
            .expect(200, done);
    });

    it('138 - Get food consumption by event name', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('139 - Get food consumption by record for day', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}/for-day/2021-09-16`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('140 - Search food consumption records', function(done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('141 - Update food consumption', function(done) {
        loadFoodUpdateModel();
        const updateModel = getTestData("FoodUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.FoodConsumption.ConsumedAs).to.equal(getTestData("FoodUpdateModel").ConsumedAs);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodUpdateModel").Calories);
                expect(response.body.Data.FoodConsumption.StartTime).to.equal(getTestData("FoodUpdateModel").StartTime);
                expect(response.body.Data.FoodConsumption.EndTime).to.equal(getTestData("FoodUpdateModel").EndTime);

            })
            .expect(200, done);
    });

    it('142 - Delete food consumption', function(done) {
       
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.FoodConsumption.ConsumedAs).to.equal(getTestData("FoodCreateModel").ConsumedAs);
                expect(response.body.Data.FoodConsumption.Calories).to.equal(getTestData("FoodCreateModel").Calories);
                expect(response.body.Data.FoodConsumption.StartTime).to.equal(getTestData("FoodCreateModel").StartTime);
                expect(response.body.Data.FoodConsumption.EndTime).to.equal(getTestData("FoodCreateModel").EndTime);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadFoodCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : "roti",
        Description   : "mins",
        ConsumedAs    : "Lunch",
        Calories      : 100,
        StartTime     : "2021-09-16T00:00:00.000Z",
        EndTime       : "2021-09-16T00:00:00.000Z"
  
    };
    setTestData(model, "FoodCreateModel");
};

export const loadFoodUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : "Rice",
        Description   : "mins",
        ConsumedAs    : "Dinner",
        Calories      : 200,
        StartTime     : "2021-09-16T09:45:00.000Z",
        EndTime       : "2021-09-16T09:50:00.000Z"
    
    };
    setTestData(model, "FoodUpdateModel");
};

function loadFoodQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?food=roti';
    return queryString;
}
