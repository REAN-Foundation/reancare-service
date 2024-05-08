import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('82 - User task tests', function () {
    var agent = request.agent(infra._app);

    it('82:01 -> Get user task categories', function (done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:02 -> Get user action types', function (done) {
        agent
            .get(`/api/v1/user-tasks/action-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:03 -> Create task', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.UserTask.id, 'taskId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('82:04 -> Get task by id', function (done) {
        agent
            .get(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:05 -> Update task', function (done) {
        loadTaskUpdateModel();
        const updateModel = getTestData('taskUpdateModel');
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:06 -> Start task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:07 -> Search careplan tasks', function (done) {
        loadUserTaskSearchModel();
        const searchModel = getTestData('UserTaskSearchModel');
        agent
            .get(`/api/v1/user-tasks/search?${loadUserTaskSearchModel}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:08 -> Finish task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/finish`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask.UserId).to.equal(getTestData('taskCreateModel').UserId);
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('82:09 -> Cancel task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/cancel`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create task again', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.UserTask.id, 'taskId_1');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData('taskCreateModel').UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData('taskCreateModel').Task);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData('taskCreateModel').ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData('taskCreateModel').IsRecurrent);
            })
            .expect(201, done);
    });

    it('82:10 -> Delete task', function (done) {
        agent
            .delete(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create task again', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.UserTask.id, 'taskId');
                expect(response.body.Data.UserTask).to.have.property('id');
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask).to.have.property('Task');
                expect(response.body.Data.UserTask).to.have.property('Category');
                expect(response.body.Data.UserTask).to.have.property('ActionType');
                expect(response.body.Data.UserTask).to.have.property('ActionId');
                expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
                expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
                expect(response.body.Data.UserTask).to.have.property('IsRecurrent');

                expect(response.body.Data.UserTask.UserId).to.equal(getTestData('taskCreateModel').UserId);
                expect(response.body.Data.UserTask.Task).to.equal(getTestData('taskCreateModel').Task);
                expect(response.body.Data.UserTask.ActionId).to.equal(getTestData('taskCreateModel').ActionId);
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData('taskCreateModel').IsRecurrent);
            })
            .expect(201, done);
    });

    it('82:11 -> Negative - Get user task categories', function (done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('82:12 -> Negative - Create task', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('82:13 -> Negative - Update task', function (done) {
        loadTaskUpdateModel();
        const updateModel = getTestData('taskUpdateModel');
        agent
            .put(`/api/v1/user-tasks/${getTestData('task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('82:14 -> Negative - Start task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('task_Id')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('82:15 -> Negative - Cancel task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('task_Id')}/cancel`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('82:16 -> Negative - Delete task', function (done) {
        agent
            .delete(`/api/v1/user-tasks/${getTestData('task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadTaskCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Task: faker.lorem.word(),
        Category: 'Custom',
        ActionType: 'Medication',
        ActionId: faker.string.uuid(),
        ScheduledStartTime: startDate,
        ScheduledEndTime: endDate,
        IsRecurrent: false,
    };
    setTestData(model, 'taskCreateModel');
};

export const loadTaskUpdateModel = async () => {
    const model = {
        Task: faker.lorem.word(),
        Category: 'Custom',
        ScheduledStartTime: startDate,
        ScheduledEndTime: endDate,
    };
    setTestData(model, 'taskUpdateModel');
};

export const loadUserTaskSearchModel = async () => {
    const queryString = ``;
};
