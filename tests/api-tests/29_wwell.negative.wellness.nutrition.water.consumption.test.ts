import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Nutrition water consumption tests', function() {

    var agent = request.agent(infra._app);

    it('69 - Negative - Create water consumption', function(done) {
        loadWaterCreateModel();
        const createModel = getTestData("WaterCreate");
        agent
            .post(`/api/v1/wellness/nutrition/water-consumptions/`)
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

    it('70 - Negative - Get water consumption by id', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('Water')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('71 - Negative - Update water consumption', function(done) {
        loadWaterUpdateModel();
        const updateModel = getTestData("WaterUpdateModel");
        agent
            .put(`/api/v1/wellness/nutrition/water-consumptions/${getTestData('WaterId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
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

