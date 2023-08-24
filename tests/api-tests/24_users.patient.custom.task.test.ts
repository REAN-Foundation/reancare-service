import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient custom task tests', function() {

    var agent = request.agent(infra._app);

    it('101 - Create patient custom task', function(done) {
        loadPatientCustomTaskCreateModel();
        const createModel = getTestData("PatientCustomTaskCreateModel");
        agent
            .post(`/api/v1/custom-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'PatientCustomTaskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'PatientCustomTaskId');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("PatientCustomTaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("PatientCustomTaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("PatientCustomTaskCreateModel").Category);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("PatientCustomTaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("PatientCustomTaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    // it('102 - Get patient custom task by id', function(done) {
    //     const id = `${getTestData('PatientCustomTaskId')}`;
    //     agent
    //         .get(`/api/v1/custom-tasks/${getTestData('PatientCustomTaskId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body.Data.UserTask).to.have.property('id');
    //             expect(response.body.Data.UserTask).to.have.property('UserId');
    //             expect(response.body.Data.UserTask).to.have.property('Task');
    //             expect(response.body.Data.UserTask).to.have.property('Category');
    //             expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
    //             expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

    //             expect(response.body.Data.UserTask.UserId).to.equal(getTestData("PatientCustomTaskCreateModel").UserId);
    //             expect(response.body.Data.UserTask.Task).to.equal(getTestData("PatientCustomTaskCreateModel").Task);
    //             expect(response.body.Data.UserTask.Category).to.equal(getTestData("PatientCustomTaskCreateModel").Category);
    //             expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("PatientCustomTaskCreateModel").ScheduledStartTime);
    //             expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("PatientCustomTaskCreateModel").IsRecurrent);
    //         })
    //         .expect(200, done);
    // });

    // it('103 - Update patient custom task', function(done) {
    //     loadPatientCustomTaskUpdateModel();
    //     const updateModel = getTestData("PatientCustomTaskUpdateModel");
    //     agent
    //         .put(`/api/v1/custom-tasks/${getTestData('PatientCustomTaskId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(updateModel)
    //         .expect(response => {
    //             expect(response.body.Data.UserTask).to.have.property('id');
    //             expect(response.body.Data.UserTask).to.have.property('UserId');
    //             expect(response.body.Data.UserTask).to.have.property('Task');
    //             expect(response.body.Data.UserTask).to.have.property('Category');
    //             expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
    //             expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

    //             expect(response.body.Data.UserTask.UserId).to.equal(getTestData("PatientCustomTaskUpdateModel").UserId);
    //             expect(response.body.Data.UserTask.Task).to.equal(getTestData("PatientCustomTaskUpdateModel").Task);
    //             expect(response.body.Data.UserTask.Category).to.equal(getTestData("PatientCustomTaskUpdateModel").Category);
    //             expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("PatientCustomTaskUpdateModel").ScheduledStartTime);
    //             expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("PatientCustomTaskUpdateModel").IsRecurrent);

    //         })
    //         .expect(200, done);
    // });

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
