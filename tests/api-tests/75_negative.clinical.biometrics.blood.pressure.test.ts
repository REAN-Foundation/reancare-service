import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Blood pressure tests', function() {

    var agent = request.agent(infra._app);

    it('196 - Negative - Create blood pressure', function(done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData("BloodPressureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('197 - Negative - Search blood pressure records', function(done) {
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

    it('198 - Negative - Delete blood pressure', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('BloodPressure')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
