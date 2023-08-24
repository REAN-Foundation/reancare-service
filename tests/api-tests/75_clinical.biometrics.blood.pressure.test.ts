import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Blood pressure tests', function() {

    var agent = request.agent(infra._app);

    it('350 - Create blood pressure', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureCreateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });

    it('351 - Get blood pressure by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
             
                expect(response.body.Data.BloodPressure.id).to.equal(getTestData("BloodPressureId"));
                
            })
            .expect(200, done);
    });

    it('352 - Search blood pressure records', function(done) {
        loadBloodPressureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/search${loadBloodPressureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('353 - Update blood pressure', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureUpdateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureUpdateModel").RecordedByUserId);

            })
            .expect(200, done);
    });

    it('354 - Delete blood pressure', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.BloodPressure.RecordDate).to.equal(getTestData("BloodPressureCreateModel").RecordDate);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(getTestData("BloodPressureCreateModel").RecordedByUserId);

            })
            .expect(201, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadBloodPressureCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : 120,
        Diastolic        : 90,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-12T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
    };
    setTestData(model, "BloodPressureCreateModel");
};

export const loadBloodPressureUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : 110,
        Diastolic        : 80,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-12T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
    };
    setTestData(model, "BloodPressureUpdateteModel");
};

function loadBloodPressureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?MinDiastolicValue=80&MaxDiastolicValue=180';
    return queryString;
}
