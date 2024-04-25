import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('106 - User task tests', function() {

    var agent = request.agent(infra._app);

    it('106:01 -> Get user task categories', function(done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('106:02 -> Get user action types', function(done) {
        agent
            .get(`/api/v1/user-tasks/action-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('106:03 -> Create task', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId_1');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId_1');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('106:04 -> Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('TaskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(200, done);
    });

    it('106:05 -> Update task', function(done) {
        loadTaskUpdateModel();
        const updateModel = getTestData("TaskUpdateModel");
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
            })
            .expect(200, done);
    });

    it('106:06 -> Start task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId_1')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('106:07 -> Search careplan tasks', function(done) {
      loadUserTaskSearchModel();
      const searchModel = getTestData('UserTaskSearchModel');
      agent
          .get(`/api/v1/user-tasks/search?category=Educational-Link&userId=${getTestData("PatientUserId_5")}`)
          .set('Content-Type', 'application/json')
          .set('x-api-key', `${process.env.TEST_API_KEY}`)
          .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
          .expect(response => {
              expect(response.body).to.have.property('Status');
              expect(response.body.Status).to.equal('success');
          })
          .expect(200, done);
  });

    it('106:08 -> Finish task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId_1')}/finish`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('106:09 -> Create task again', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId_1');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId_1');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('106:10 -> Cancel task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId_1')}/cancel`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserTask.id, 'TaskId_1');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                setTestData(response.body.Data.UserTask.id, 'TaskId_1');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData("TaskCreateModel").UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData("TaskCreateModel").Task);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('106:11 -> Delete task', function(done) {
        
        agent
            .delete(`/api/v1/user-tasks/${getTestData('TaskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
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
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData("TaskCreateModel").ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("TaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    it('106:12 -> Negative - Get user task categories', function(done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('106:13 -> Negative - Create task', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('106:14 -> Negative - Update task', function(done) {
        loadTaskUpdateModel();
        const updateModel = getTestData("TaskUpdateModel");
        agent
            .put(`/api/v1/user-tasks/${getTestData('Task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('106:15 -> Negative - Start task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('Task_Id')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('106:16 -> Negative - Cancel task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('Task_Id')}/cancel`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('106:17 -> Negative - Delete task', function(done) {
        
        agent
            .delete(`/api/v1/user-tasks/${getTestData('Task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadTaskCreateModel = async (
) => {
    const model = {
        UserId             : getTestData("PatientUserId"),
        Task               : faker.lorem.word(),
        Category           : "Custom",
        ActionType         : "Medication",
        ActionId           : faker.string.uuid(),
        ScheduledStartTime : startDate,
        ScheduledEndTime   : endDate,
        IsRecurrent        : false
    
    };
    setTestData(model, "TaskCreateModel");
};

export const loadTaskUpdateModel = async (
) => {
    const model = {
        Task               : faker.lorem.word(),
        Category           : "Custom",
        ScheduledStartTime : startDate,
        ScheduledEndTime   : endDate
      
    };
    setTestData(model, "TaskUpdateModel");
};

function loadAssessmentQueryString() {
  //This is raw query. Please modify to suit the test
  const queryString = `?category=Educational-Link&userId=${"PatientUserId_1"}`;
  return queryString;
}

export const loadUserTaskSearchModel = async (
  ) => {
    const queryString = `?category=Educational-Link&userId=${"PatientUserId_1"}`;
      setTestData(queryString, 'UserTaskSearchModel');
  };


