import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Nutrition water consumption tests', function() {

    var agent = request.agent(infra._app);

    it('131 - Create water consumption', function(done) {
        loadWaterCreateModel();
        const createModel = getTestData("WaterCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/water-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.WaterConsumption.Time).to.equal(getTestData("WaterCreateModel").Time);

            })
            .expect(201, done);
    });

    it('132 - Get water consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.WaterConsumption).to.have.property('id');
                expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                expect(response.body.Data.WaterConsumption).to.have.property('Time');

                expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterCreateModel").PatientUserId);
                expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterCreateModel").Volume);
                expect(response.body.Data.WaterConsumption.Time).to.equal(getTestData("WaterCreateModel").Time);
            })
            .expect(200, done);
    });

    it('133 - Search water consumption records', function(done) {
        loadWaterQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/search${loadWaterQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('134 - Update water consumption', function(done) {
        loadWaterUpdateModel();
        const updateModel = getTestData("WaterUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.WaterConsumption).to.have.property('id');
                expect(response.body.Data.WaterConsumption).to.have.property('PatientUserId');
                expect(response.body.Data.WaterConsumption).to.have.property('Volume');
                expect(response.body.Data.WaterConsumption).to.have.property('Time');

                expect(response.body.Data.WaterConsumption.PatientUserId).to.equal(getTestData("WaterUpdateModel").PatientUserId);
                expect(response.body.Data.WaterConsumption.Volume).to.equal(getTestData("WaterUpdateModel").Volume);
                expect(response.body.Data.WaterConsumption.Time).to.equal(getTestData("WaterUpdateModel").Time);

            })
            .expect(200, done);
    });

    it('135 - Delete water consumption', function(done) {
        
        agent
            .delete(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.WaterConsumption.Time).to.equal(getTestData("WaterCreateModel").Time);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadWaterCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Volume        : 7,
        Time          : "2021-09-21T00:00:00.000Z"
  
    };
    setTestData(model, "WaterCreateModel");
};

export const loadWaterUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Volume        : 10,
        Time          : "2021-09-21T00:00:00.000Z"
    
    };
    setTestData(model, "WaterUpdateModel");
};

function loadWaterQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?dailyVolumeFrom=5&dailyVolumeTo=12';
    return queryString;
}
