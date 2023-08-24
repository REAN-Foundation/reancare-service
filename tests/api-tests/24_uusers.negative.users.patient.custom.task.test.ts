import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient custom task tests', function() {

    var agent = request.agent(infra._app);

    it('53 - Negative - Create patient custom task', function(done) {
        loadPatientCustomTaskCreateModel();
        const createModel = getTestData("PatientCustomTaskModel");
        agent
            .post(`/api/v1/custom-tasks/`)
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

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientCustomTaskCreateModel = async (
) => {
    const model = {
        UserId      : getTestData("PatientUserId"),
        Task        : "Take a walk",
        Description : "Take a walk 30 min. in morning",
        Category    : "Exercise",
        Details     : {
            ExerciseType   : "Brisk walk",
            IntensityLevel : "Moderate"
        },
        ScheduledStartTime : "2022-07-01T00:00:00.000Z",
        IsRecurrent        : false
  
    };
    setTestData(model, "PatientCustomTaskCreateModel");
};

export const loadPatientCustomTaskUpdateModel = async (
) => {
    const model = {
        UserId      : getTestData("PatientUserId"),
        Task        : "Take a jog",
        Description : "Jog for 30 min. in morning",
        Category    : "Exercise",
        Details     : {
            ExerciseType   : "Jog",
            IntensityLevel : "Hard"
        },
        ScheduledStartTime : "2022-07-01T00:00:00.000Z",
        IsRecurrent        : false
    
    };
    setTestData(model, "PatientCustomTaskUpdateModel");
};
