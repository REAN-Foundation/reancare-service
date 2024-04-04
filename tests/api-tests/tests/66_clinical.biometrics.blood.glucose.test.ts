import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { pastDateString } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('66 - Blood glucose tests', function() {

    var agent = request.agent(infra._app);

    it('66:01 -> Create blood glucose', function(done) {
        loadBloodGlucoseCreateModel();
        const createModel = getTestData("BloodGlucoseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-glucose`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodGlucose.id, 'BloodGlucoseId_1');
                expect(response.body.Data.BloodGlucose).to.have.property('PatientUserId');
                expect(response.body.Data.BloodGlucose).to.have.property('BloodGlucose');
                expect(response.body.Data.BloodGlucose).to.have.property('Unit');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordDate');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.BloodGlucose.id, 'BloodGlucoseId_1');
                
                expect(response.body.Data.BloodGlucose.PatientUserId).to.equal(getTestData("BloodGlucoseCreateModel").PatientUserId);
                expect(response.body.Data.BloodGlucose.BloodGlucose).to.equal(getTestData("BloodGlucoseCreateModel").BloodGlucose);
                expect(response.body.Data.BloodGlucose.Unit).to.equal(getTestData("BloodGlucoseCreateModel").Unit);
                expect(response.body.Data.BloodGlucose.RecordedByUserId).to.equal(getTestData("BloodGlucoseCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('66:02 -> Get blood glucose by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodGlucose).to.have.property('id');
                expect(response.body.Data.BloodGlucose).to.have.property('EhrId');
                expect(response.body.Data.BloodGlucose).to.have.property('PatientUserId');
                expect(response.body.Data.BloodGlucose).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodGlucose).to.have.property('Provider');
                expect(response.body.Data.BloodGlucose).to.have.property('BloodGlucose');
                expect(response.body.Data.BloodGlucose).to.have.property('Unit');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordDate');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordedByUserId');
            })
            .expect(200, done);
    });

    it('66:03 -> Search blood glucose records', function(done) {
        loadBloodGlucoseQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-glucose/search${loadBloodGlucoseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodGlucoseRecords).to.have.property('TotalCount');
                expect(response.body.Data.BloodGlucoseRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BloodGlucoseRecords).to.have.property('PageIndex');
                expect(response.body.Data.BloodGlucoseRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BloodGlucoseRecords).to.have.property('Order');
                expect(response.body.Data.BloodGlucoseRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BloodGlucoseRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BloodGlucoseRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('66:04 -> Update blood glucose', function(done) {
        loadBloodGlucoseUpdateModel();
        const updateModel = getTestData("BloodGlucoseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BloodGlucose).to.have.property('id');
                expect(response.body.Data.BloodGlucose).to.have.property('EhrId');
                expect(response.body.Data.BloodGlucose).to.have.property('PatientUserId');
                expect(response.body.Data.BloodGlucose).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodGlucose).to.have.property('Provider');
                expect(response.body.Data.BloodGlucose).to.have.property('BloodGlucose');
                expect(response.body.Data.BloodGlucose).to.have.property('Unit');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordDate');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodGlucose.PatientUserId).to.equal(getTestData("BloodGlucoseUpdateModel").PatientUserId);
                expect(response.body.Data.BloodGlucose.BloodGlucose).to.equal(getTestData("BloodGlucoseUpdateModel").BloodGlucose);
                expect(response.body.Data.BloodGlucose.Unit).to.equal(getTestData("BloodGlucoseUpdateModel").Unit);
                expect(response.body.Data.BloodGlucose.RecordedByUserId).to.equal(getTestData("BloodGlucoseUpdateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('66:05 -> Delete blood glucose', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create blood glucose again', function(done) {
        loadBloodGlucoseCreateModel();
        const createModel = getTestData("BloodGlucoseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-glucose`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodGlucose.id, 'BloodGlucoseId');
                expect(response.body.Data.BloodGlucose).to.have.property('PatientUserId');
                expect(response.body.Data.BloodGlucose).to.have.property('BloodGlucose');
                expect(response.body.Data.BloodGlucose).to.have.property('Unit');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordDate');
                expect(response.body.Data.BloodGlucose).to.have.property('RecordedByUserId');
             
                setTestData(response.body.Data.BloodGlucose.id, 'BloodGlucoseId');
              
                expect(response.body.Data.BloodGlucose.PatientUserId).to.equal(getTestData("BloodGlucoseCreateModel").PatientUserId);
                expect(response.body.Data.BloodGlucose.BloodGlucose).to.equal(getTestData("BloodGlucoseCreateModel").BloodGlucose);
                expect(response.body.Data.BloodGlucose.Unit).to.equal(getTestData("BloodGlucoseCreateModel").Unit);
                expect(response.body.Data.BloodGlucose.RecordedByUserId).to.equal(getTestData("BloodGlucoseCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('66:06 -> Negative - Create blood glucose', function(done) {
        loadNegativeBloodGlucoseCreateModel();
        const createModel = getTestData("NegativeBloodGlucoseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-glucose`)
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

    it('66:07 -> Negative - Get blood glucose by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('66:08 -> Negative - Update blood glucose', function(done) {
        loadBloodGlucoseUpdateModel();
        const updateModel = getTestData("BloodGlucoseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId')}`)
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

export const loadBloodGlucoseCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData('PatientUserId'),
        Unit             : "mg|dL",
        BloodGlucose     : faker.number.int({ min:95, max: 105 }),
        RecordDate       : pastDateString,
        RecordedByUserId : getTestData('PatientUserId')

    };
    setTestData(model, "BloodGlucoseCreateModel");
};

export const loadBloodGlucoseUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData('PatientUserId'),
        Unit             : "mg|dL",
        BloodGlucose     : faker.number.int({ min:95, max: 105 }),
        RecordDate       : pastDateString,
        RecordedByUserId : getTestData('PatientUserId'),
    };
    setTestData(model, "BloodGlucoseUpdateModel");
};

function loadBloodGlucoseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBloodGlucoseCreateModel = async (
) => {
    const model = {
        Unit         : faker.string.symbol(),
        BloodGlucose : faker.number.int({ max: 75 }),
        RecordDate   : faker.date.anytime(),
    };
    setTestData(model, "NegativeBloodGlucoseCreateModel");
};
