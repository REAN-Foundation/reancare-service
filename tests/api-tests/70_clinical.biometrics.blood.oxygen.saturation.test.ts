import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Blood oxygen saturation tests', function() {

    var agent = request.agent(infra._app);

    it('325 - Create blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData("BloodOxygenSaturationCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('326 - Get blood oxygen saturation by id', function(done) {
       
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

                expect(response.body.Data.BloodOxygenSaturation.id).to.equal(getTestData("BloodOxygenSaturationId"));
                
            })
            .expect(200, done);
    });

    it('327 - Search blood oxygen saturation records', function(done) {
        loadBloodOxygenSaturationQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/search${loadBloodOxygenSaturationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('328 - Update blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData("BloodOxygenSaturationUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.BloodOxygenSaturation.RecordDate).to.equal(getTestData("BloodOxygenSaturationUpdateModel").RecordDate);

            })
            .expect(200, done);
    });

    it('329 - Delete blood oxygen saturation', function(done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

});

///////////////////////////////////////////////////////////////////////////

export const loadBloodOxygenSaturationCreateModel = async (
) => {
    const model = {
  
        PatientUserId         : getTestData('PatientUserId'),
        BloodOxygenSaturation : 85,
        Unit                  : "%",
        RecordDate            : "2021-09-12T00:00:00.000Z",
        RecordedByUserId      : getTestData('PatientUserId')
    };

    setTestData(model, "BloodOxygenSaturationCreateModel");
};

export const loadBloodOxygenSaturationUpdateModel = async (
) => {
    const model = {
  
        BloodOxygenSaturation : 90,
        RecordDate            : "2021-09-12T00:00:00.000Z"
    };
    setTestData(model, "BloodOxygenSaturationUpdateModel");
};

function loadBloodOxygenSaturationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?minValue=0&maxValue=100';
    return queryString;
}
