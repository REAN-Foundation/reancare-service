import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('28 - User task tests', function () {
    var agent = request.agent(infra._app);

    it('28:01 -> Get user task categories', function (done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('28:02 -> Get user action types', function (done) {
        agent
            .get(`/api/v1/user-tasks/action-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('28:03 -> Create task', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setUserTaskId(response, 'taskId_1');
                expectUserTaskProperties(response);

                expectUserTaskPropertyValues(response);
            })
            .expect(201, done);
    });

    it('28:04 -> Get task by id', function (done) {
        agent
            .get(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectUserTaskProperties(response);

                expectUserTaskPropertyValues(response);
            })
            .expect(200, done);
    });

    it('28:05 -> Search careplan tasks', function (done) {
        loadUserTaskSearchModel();
        agent
            .get(`/api/v1/user-tasks/search?${loadUserTaskSearchModel()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('28:06 -> Update task', function (done) {
        loadTaskUpdateModel();
        const updateModel = getTestData('taskUpdateModel');
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectUserTaskProperties(response);

                expect(response.body.Data.UserTask.Task).to.equal(getTestData('taskUpdateModel').Task);
            })
            .expect(200, done);
    });

    it('28:07 -> Start task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('28:08 -> Finish task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/finish`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.UserTask).to.have.property('UserId');
                expect(response.body.Data.UserTask.UserId).to.equal(getTestData('taskCreateModel').UserId);
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('28:09 -> Create task again', function (done) {
        loadTaskCreateModel();
        const createModel = getTestData('taskCreateModel');
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setUserTaskId(response, 'taskId_1');
                expectUserTaskProperties(response);

                expectUserTaskPropertyValues(response);
            })
            .expect(201, done);
    });

    it('28:10 -> Cancel task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('taskId_1')}/cancel`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
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
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setUserTaskId(response, 'taskId_1');
                expectUserTaskProperties(response);

                expectUserTaskPropertyValues(response);
            })
            .expect(201, done);
    });

    it('28:11 -> Delete task', function (done) {
        agent
            .delete(`/api/v1/user-tasks/${getTestData('taskId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
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
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setUserTaskId(response, 'taskId');
                expectUserTaskProperties(response);

                expectUserTaskPropertyValues(response);
            })
            .expect(201, done);
    });

    it('28:12 -> Negative - Get user task categories', function (done) {
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

    it('28:13 -> Negative - Create task', function (done) {
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

    it('28:14 -> Negative - Update task', function (done) {
        loadTaskUpdateModel();
        const updateModel = getTestData('taskUpdateModel');
        agent
            .put(`/api/v1/user-tasks/${getTestData('task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('28:15 -> Negative - Start task', function (done) {
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

    it('28:16 -> Negative - Cancel task', function (done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('task_Id')}/cancel`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('28:17 -> Negative - Delete task', function (done) {
        agent
            .delete(`/api/v1/user-tasks/${getTestData('task_Id')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setUserTaskId(response, key) {
    setTestData(response.body.Data.UserTask.id, key);
}

function expectUserTaskProperties(response) {
    expect(response.body.Data.UserTask).to.have.property('id');
    expect(response.body.Data.UserTask).to.have.property('UserId');
    expect(response.body.Data.UserTask).to.have.property('Task');
    expect(response.body.Data.UserTask).to.have.property('Category');
    expect(response.body.Data.UserTask).to.have.property('ActionType');
    expect(response.body.Data.UserTask).to.have.property('ActionId');
    expect(response.body.Data.UserTask).to.have.property('ScheduledStartTime');
    expect(response.body.Data.UserTask).to.have.property('ScheduledEndTime');
    expect(response.body.Data.UserTask).to.have.property('IsRecurrent');
}

function expectUserTaskPropertyValues(response) {
    expect(response.body.Data.UserTask.UserId).to.equal(getTestData('taskCreateModel').UserId);
    expect(response.body.Data.UserTask.Task).to.equal(getTestData('taskCreateModel').Task);
    expect(response.body.Data.UserTask.ActionId).to.equal(getTestData('taskCreateModel').ActionId);
    expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData('taskCreateModel').IsRecurrent);
}

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
