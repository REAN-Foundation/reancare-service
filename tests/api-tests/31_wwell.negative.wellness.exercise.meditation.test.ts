import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Meditation tests', function() {

    var agent = request.agent(infra._app);

    it('76 - Negative - Create meditation', function(done) {
        loadMeditationCreateModel();
        const createModel = getTestData("Meditationl");
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('77 - Negative - Get meditation by id', function(done) {

        agent
            .get(`/api/v1/wellness/exercise/meditations/${getTestData('Meditation')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('78 - Negative - Update meditation', function(done) {
        loadMeditationUpdateModel();
        const updateModel = getTestData("MeditationUpdateModel");
        agent
            .put(`/api/v1/wellness/exercise/meditations/${getTestData('MeditationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadMeditationCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Meditation    : "Breathing",
        Description   : "Everyday meditation",
        Category      : "Exercise",
        StartTime     : "2021-09-21T05:30:00.000Z",
        EndTime       : "2021-09-21T05:45:00.000Z"
  
    };
    setTestData(model, "MeditationCreateModel");
};

export const loadMeditationUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Meditation    : "Breathing",
        Description   : "Exercise",
        Category      : "Mindfulness",
        StartTime     : "2021-09-22T06:30:00.000Z",
        EndTime       : "2021-09-22T06:45:00.000Z"
    
    };
    setTestData(model, "MeditationUpdateModel");
};
