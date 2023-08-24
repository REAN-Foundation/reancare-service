import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Blood glucose tests', function() {

    var agent = request.agent(infra._app);

    it('199 - Negative - Create blood glucose', function(done) {
        loadBloodGlucoseCreateModel();
        const createModel = getTestData("BloodGlucoseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-glucose`)
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

    it('200 - Negative - Get blood glucose by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucose')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('201 - Negative - Update blood glucose', function(done) {
        loadBloodGlucoseUpdateModel();
        const updateModel = getTestData("BloodGlucoseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-glucose/${getTestData('BloodGlucoseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBloodGlucoseCreateModel = async (
) => {
    const model = {

    };
    setTestData(model, "BloodGlucoseCreateModel");
};

export const loadBloodGlucoseUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData('PatientUserId'),
        Unit             : "mg|dL",
        BloodGlucose     : 106,
        RecordDate       : "2021-09-12T00:00:00.000Z",
        RecordedByUserId : getTestData('PatientUserId'),
    };
    setTestData(model, "BloodGlucoseUpdateModel");
};
