import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('65 - Blood pressure tests', function() {

    var agent = request.agent(infra._app);

    it('65:01 -> Create blood pressure', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId_1');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId_1');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('65:02 -> Get blood pressure by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('EhrId');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodPressure).to.have.property('Provider');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');
             
                expect(response.body.Data.BloodPressure.id).to.equal(getTestData("BloodPressureId_1"));
                
            })
            .expect(200, done);
    });

    it('65:03 -> Search blood pressure records', function(done) {
        loadBloodPressureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/search${loadBloodPressureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BloodPressureRecords).to.have.property('TotalCount');
                expect(response.body.Data.BloodPressureRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BloodPressureRecords).to.have.property('PageIndex');
                expect(response.body.Data.BloodPressureRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BloodPressureRecords).to.have.property('Order');
                expect(response.body.Data.BloodPressureRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BloodPressureRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BloodPressureRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('65:04 -> Update blood pressure', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BloodPressure).to.have.property('id');
                expect(response.body.Data.BloodPressure).to.have.property('EhrId');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('TerraSummaryId');
                expect(response.body.Data.BloodPressure).to.have.property('Provider');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');

                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureUpdateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureUpdateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureUpdateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureUpdateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('65:05 -> Delete blood pressure', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create blood pressure again', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');
                expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
                expect(response.body.Data.BloodPressure).to.have.property('Systolic');
                expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
                expect(response.body.Data.BloodPressure).to.have.property('Unit');
                expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
                expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');
             
                setTestData(response.body.Data.BloodPressure.id, 'BloodPressureId');

                expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData("BloodPressureCreateModel").PatientUserId);
                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData("BloodPressureCreateModel").Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData("BloodPressureCreateModel").Diastolic);
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData("BloodPressureCreateModel").Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('65:06 -> Negative - Create blood pressure', function(done) {
        loadNegativeBloodPressureCreateModel();
        const createModel = getTestData("NegativeBloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
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

    it('65:07 -> Negative - Search blood pressure records', function(done) {
        loadBloodPressureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/search${loadBloodPressureQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('65:08 -> Negative - Delete blood pressure', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId_1')}`)
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

export const loadBloodPressureCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : faker.number.int({ min: 100, max: 150 }),
        Diastolic        : faker.number.int({ min: 100, max: 150 }),
        Unit             : faker.string.symbol(),
        RecordDate       : faker.date.anytime(),
        RecordedByUserId : getTestData("PatientUserId")
    };
    setTestData(model, "BloodPressureCreateModel");
};

export const loadBloodPressureUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : faker.number.int({ min: 100, max: 150 }),
        Diastolic        : faker.number.int({ min: 100, max: 150 }),
        Unit             : faker.string.symbol(),
        RecordDate       : faker.date.anytime(),
        RecordedByUserId : getTestData("PatientUserId")
    };
    setTestData(model, "BloodPressureUpdateteModel");
};

function loadBloodPressureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBloodPressureCreateModel = async (
) => {
    const model = {
        Unit       : faker.string.symbol(),
        RecordDate : faker.date.anytime(),
    };
    setTestData(model, "NegativeBloodPressureCreateModel");
};
