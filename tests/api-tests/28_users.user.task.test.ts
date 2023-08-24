import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('User task tests', function() {

    var agent = request.agent(infra._app);

    it('121 - Get user task categories', function(done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('122 - Get user action types', function(done) {
        agent
            .get(`/api/v1/user-tasks/action-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('123 - Create task', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskCreateModel").Category);
                expect(response.body.Data.UserTask.ActionType).to.equal(getTestData("TaskCreateModel").ActionType);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskCreateModel").ScheduledEndTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('124 - Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskCreateModel").Category);
                expect(response.body.Data.UserTask.ActionType).to.equal(getTestData("TaskCreateModel").ActionType);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskCreateModel").ScheduledEndTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(200, done);
    });

    it('125 - Update task', function(done) {
        loadTaskUpdateModel();
        const updateModel = getTestData("TaskUpdateModel");
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskUpdateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskUpdateModel").Category);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskUpdateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskUpdateModel").ScheduledEndTime);
            })
            .expect(200, done);
    });

    it('126 - Start task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('127 - Finish task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId')}/finish`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('128 - Create task again', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskCreateModel").Category);
                expect(response.body.Data.UserTask.ActionType).to.equal(getTestData("TaskCreateModel").ActionType);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskCreateModel").ScheduledEndTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('129 - Cancel task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId')}/cancel`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('Create task again', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskCreateModel").Category);
                expect(response.body.Data.UserTask.ActionType).to.equal(getTestData("TaskCreateModel").ActionType);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskCreateModel").ScheduledEndTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('130 - Delete task', function(done) {
        
        agent
            .delete(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create task again', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.Category).to.equal(getTestData("TaskCreateModel").Category);
                expect(response.body.Data.UserTask.ActionType).to.equal(getTestData("TaskCreateModel").ActionType);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.ScheduledStartTime).to.equal(getTestData("TaskCreateModel").ScheduledStartTime);
                expect(response.body.Data.UserTask.ScheduledEndTime).to.equal(getTestData("TaskCreateModel").ScheduledEndTime);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadTaskCreateModel = async (
) => {
    const model = {
        UserId             : getTestData("PatientUserId"),
        Task               : "Take medication",
        Category           : "Custom",
        ActionType         : "Medication",
        ActionId           : "3dab5783-2b20-4e17-ae88-ef4562c85772",
        ScheduledStartTime : "2021-10-11T05:30:00.000Z",
        ScheduledEndTime   : "2021-10-11T07:30:00.000Z",
        IsRecurrent        : false
    
    };
    setTestData(model, "TaskCreateModel");
};

export const loadTaskUpdateModel = async (
) => {
    const model = {
        Task               : "Run a mile",
        Category           : "Exercise",
        ScheduledStartTime : "2023-10-15T09:30:00.000Z",
        ScheduledEndTime   : "2024-10-15T12:30:00.000Z"
      
    };
    setTestData(model, "TaskUpdateModel");
};

