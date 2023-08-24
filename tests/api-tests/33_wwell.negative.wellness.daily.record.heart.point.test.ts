import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Heart points records tests', function() {

    var agent = request.agent(infra._app);

    it('82 - Negative - Create heart points', function(done) {
        loadHeartPointCreateModel();
        const createModel = getTestData("HeartPoint");
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
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

    it('83 - Negative - Get heart points by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPoint')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('84 - Negative - Update heart points', function(done) {
        loadHeartPointUpdateModel();
        const updateModel = getTestData("HeartPointUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
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

export const loadHeartPointCreateModel = async (
) => {
    const model = {
        PersonId      : getTestData("PatientPersonId"),
        PatientUserId : getTestData("PatientUserId"),
        HeartPoints   : 8,
        Unit          : "30"
  
    };
    setTestData(model, "HeartPointCreateModel");
};

export const loadHeartPointUpdateModel = async (
) => {
    const model = {
        PersonId      : getTestData("PatientPersonId"),
        PatientUserId : getTestData("PatientUserId"),
        HeartPoints   : 150,
        Unit          : "25"
    
    };
    setTestData(model, "HeartPointUpdateModel");
};
