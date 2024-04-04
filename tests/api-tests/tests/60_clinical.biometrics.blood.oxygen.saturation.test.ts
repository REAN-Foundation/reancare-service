import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('60 - Blood oxygen saturation tests', function() {

    var agent = request.agent(infra._app);

    it('60:01 -> Create blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData("BloodOxygenSaturationCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodOxygenSaturation.id, 'BloodOxygenSaturationId_1');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('id');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('PatientUserId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('BloodOxygenSaturation');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Unit');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordDate');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordedByUserId');

                setTestData(response.body.Data.BloodOxygenSaturation.id, 'BloodOxygenSaturationId_1');
             
                expect(response.body.Data.BloodOxygenSaturation.PatientUserId).to.equal(getTestData("BloodOxygenSaturationCreateModel").PatientUserId);
                expect(response.body.Data.BloodOxygenSaturation.BloodOxygenSaturation).to.equal(getTestData("BloodOxygenSaturationCreateModel").BloodOxygenSaturation);
                expect(response.body.Data.BloodOxygenSaturation.Unit).to.equal(getTestData("BloodOxygenSaturationCreateModel").Unit);
                expect(response.body.Data.BloodOxygenSaturation.RecordedByUserId).to.equal(getTestData("BloodOxygenSaturationCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('60:02 -> Get blood oxygen saturation by id', function(done) {
       
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('id');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('EhrId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('PatientUserId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Provider');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('BloodOxygenSaturation');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Unit');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordDate');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodOxygenSaturation.id).to.equal(getTestData("BloodOxygenSaturationId_1"));
                
            })
            .expect(200, done);
    });

    it('60:03 -> Search blood oxygen saturation records', function(done) {
        loadBloodOxygenSaturationQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/search${loadBloodOxygenSaturationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('TotalCount');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('PageIndex');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('Order');
                expect(response.body.Data.BloodOxygenSaturationRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BloodOxygenSaturationRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BloodOxygenSaturationRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('60:04 -> Update blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData("BloodOxygenSaturationUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('id');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('EhrId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('PatientUserId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Provider');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('BloodOxygenSaturation');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Unit');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordDate');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodOxygenSaturation.BloodOxygenSaturation).to.equal(getTestData("BloodOxygenSaturationUpdateModel").BloodOxygenSaturation);

            })
            .expect(200, done);
    });

    it('60:05 -> Delete blood oxygen saturation', function(done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create blood oxygen saturation again', function(done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData("BloodOxygenSaturationCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodOxygenSaturation.id, 'BloodOxygenSaturationId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('id');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('PatientUserId');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('BloodOxygenSaturation');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('Unit');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordDate');
                expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordedByUserId');

                setTestData(response.body.Data.BloodOxygenSaturation.id, 'BloodOxygenSaturationId');
           
                expect(response.body.Data.BloodOxygenSaturation.PatientUserId).to.equal(getTestData("BloodOxygenSaturationCreateModel").PatientUserId);
                expect(response.body.Data.BloodOxygenSaturation.BloodOxygenSaturation).to.equal(getTestData("BloodOxygenSaturationCreateModel").BloodOxygenSaturation);
                expect(response.body.Data.BloodOxygenSaturation.Unit).to.equal(getTestData("BloodOxygenSaturationCreateModel").Unit);
                expect(response.body.Data.BloodOxygenSaturation.RecordedByUserId).to.equal(getTestData("BloodOxygenSaturationCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('60:06 -> Negative - Create blood oxygen saturation', function(done) {
        loadNegativeBloodOxygenSaturationCreateModel();
        const createModel = getTestData("NegativeBloodOxygenSaturationCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('60:07 -> Negative - Get blood oxygen saturation by id', function(done) {
       
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('60:08 -> Negative - Update blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData("BloodOxygenSaturationUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBloodOxygenSaturationCreateModel = async (
) => {
    const model = {
        PatientUserId         : getTestData('PatientUserId'),
        BloodOxygenSaturation : faker.number.int({ min: 75, max:85 }),
        Unit                  : "%",
        RecordDate            : "2021-09-01",
        RecordedByUserId      : getTestData('PatientUserId')
    };

    setTestData(model, "BloodOxygenSaturationCreateModel");
};

export const loadBloodOxygenSaturationUpdateModel = async (
) => {
    const model = {
        BloodOxygenSaturation : faker.number.int({ min: 75, max:85 }),
        RecordDate            : "2021-09-01"
    };
    setTestData(model, "BloodOxygenSaturationUpdateModel");
};

function loadBloodOxygenSaturationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBloodOxygenSaturationCreateModel = async (
) => {
    const model = {
        BloodOxygenSaturation : faker.number.int(100),
        Unit                  : faker.string.symbol(),
        RecordDate            : faker.date.anytime(),
    };
    
    setTestData(model, "NegativeBloodOxygenSaturationCreateModel");
};
