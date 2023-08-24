import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Body weight tests', function() {

    var agent = request.agent(infra._app);

    it('187 - Negative - Create body weight', function(done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData("BodyWeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
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

    it('188 - Negative - Get body weight by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/body-weights/${getTestData('BodyWeight')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
          
            })
            .expect(404, done);
    });

    it('189 - Update body weight', function(done) {
        loadBodyWeightUpdateModel();
        const updateModel = getTestData("BodyWeightUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/body-weights/${getTestData('BodyWeightId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBodyWeightCreateModel = async (
) => {
    const model = {

    };
    setTestData(model, "BodyWeightCreateModel");
};

export const loadBodyWeightUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData('PatientUserId'),
        BodyWeight    : 180,
        Unit          : "kg"
    };
    setTestData(model, "BodyWeightUpdateModel");
};
