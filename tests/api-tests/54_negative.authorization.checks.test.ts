import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Authorization checks tests', function() {

    var agent = request.agent(infra._app);
  
    it('123 - Negative - Second patient tries to get blood pressure of first', function(done) {
   
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('124 - Negative - Second patient tries to update blood pressure of first', function(done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData("BloodPressureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressureId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt_2")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('125 - Negative - Second patient tries to delete blood pressure of first', function(done) {

        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressure')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
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
        Systolic         : 160,
        Diastolic        : 180,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-22T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
  
    };
    setTestData(model, "BloodPressureCreateModel");
};

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-7349901969",
        Password : "Test@123"
      
    };
    setTestData(model, "PatientPasswordPhoneCreateModel");
};

export const loadBloodPressureUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        Systolic         : 100,
        Diastolic        : 80,
        Unit             : "mm Hg",
        RecordDate       : "2021-09-22T00:00:00.000Z",
        RecordedByUserId : getTestData("PatientUserId")
    
    };
    setTestData(model, "BloodPressureUpdateModel");
};

