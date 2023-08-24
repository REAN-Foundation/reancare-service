import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Blood oxygen saturation tests', function() {

    var agent = request.agent(infra._app);

    it('181 - Negative - Create blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData("BloodOxygenSaturationCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
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

    it('182 - Negative - Get blood oxygen saturation by id', function(done) {
       
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturation')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('183 - Negative - Update blood oxygen saturation', function(done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData("BloodOxygenSaturationUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('BloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBloodOxygenSaturationCreateModel = async (
) => {
    const model = {
  
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

