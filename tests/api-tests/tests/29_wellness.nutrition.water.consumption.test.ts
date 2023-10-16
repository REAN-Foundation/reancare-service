import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('29 - Nutrition water consumption tests', function() {

    var agent = request.agent(infra._app);

    it('29:01 -> Create water consumption', function(done) {
            loadWaterCreateModel();
            const createModel = getTestData("WaterCreateModel");
            agent
                .post(`/api/v1/wellness/nutrition/water-consumptions/`)
                .set('Content-Type', 'application/json')
                .set('x-api-key', `${process.env.TEST_API_KEY}`)
                .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
                .send(createModel)
                .expect(response => {
                    setTestData(response.body.Data.WaterConsumption.id, 'WaterId_1');
                    expect(response.body.Data.WaterConsumption).to.have.property('id');
                    expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                    expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                    expect(response.body.Data.WaterConsumption).to.have.property('Time');

                    setTestData(response.body.Data.WaterConsumption.id, 'WaterId_1');

                    expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterCreateModel").PatientUserId);
                    expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterCreateModel").Volume);

                })
                .expect(201, done);
    });

    it('29:02 -> Get water consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.WaterConsumption).to.have.property('id');
                expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                expect(response.body.Data.WaterConsumption).to.have.property('Time');

                expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterCreateModel").PatientUserId);
                expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterCreateModel").Volume);
        
            })
            .expect(200, done);
    });

    it('29:03 -> Search water consumption records', function(done) {
        loadWaterQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/search${loadWaterQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.WaterConsumptionRecords).to.have.property('TotalCount');
                expect(response.body.Data.WaterConsumptionRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.WaterConsumptionRecords).to.have.property('PageIndex');
                expect(response.body.Data.WaterConsumptionRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.WaterConsumptionRecords).to.have.property('Order');
                expect(response.body.Data.WaterConsumptionRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.WaterConsumptionRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.WaterConsumptionRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('29:04 -> Update water consumption', function(done) {
        loadWaterUpdateModel();
        const updateModel = getTestData("WaterUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.WaterConsumption).to.have.property('id');
                expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                expect(response.body.Data.WaterConsumption).to.have.property('Time');

                expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterUpdateModel").PatientUserId);
                expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterUpdateModel").Volume);
               
            })
            .expect(200, done);
    });

    it('29:05 -> Delete water consumption', function(done) {
        
        agent
            .delete(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create water consumption again', function(done) {
        loadWaterCreateModel();
        const createModel = getTestData("WaterCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/water-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.WaterConsumption.id, 'WaterId');
                expect(response.body.Data.WaterConsumption).to.have.property('id');
                expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                expect(response.body.Data.WaterConsumption).to.have.property('Time');

                setTestData(response.body.Data.WaterConsumption.id, 'WaterId');

                expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterCreateModel").PatientUserId);
                expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterCreateModel").Volume);

            })
            .expect(201, done);
    });

    it('29:06 -> Negative - Create water consumption', function(done) {
        loadWaterCreateModel();
        const createModel = getTestData("WaterCreate");
        agent
            .post(`/api/v1/wellness/nutrition/water-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('29:07 -> Negative - Get water consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('29:08 -> Negative - Update water consumption', function(done) {
        loadWaterUpdateModel();
        const updateModel = getTestData("WaterUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadWaterCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Volume        : faker.number.int(100),
        Time          : faker.date.anytime()
  
    };
    setTestData(model, "WaterCreateModel");
};

export const loadWaterUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Volume        : faker.number.int(100),
        Time          : faker.date.anytime()
    
    };
    setTestData(model, "WaterUpdateModel");
};

function loadWaterQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
