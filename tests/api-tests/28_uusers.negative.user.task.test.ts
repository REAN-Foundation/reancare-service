import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative User task tests', function() {

    var agent = request.agent(infra._app);

    it('63 - Negative - Get user task categories', function(done) {
        agent
            .get(`/api/v1/user-tasks/categories/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('64 - Negative - Create task', function(done) {
        loadTaskCreateModel();
        const createModel = getTestData("TaskCreateModel");
        agent
            .post(`/api/v1/user-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('65 - Negative - Update task', function(done) {
        loadTaskUpdateModel();
        const updateModel = getTestData("TaskUpdateModel");
        agent
            .put(`/api/v1/user-tasks/${getTestData('Task')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('66 - Negative - Start task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('TaskId')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('67 - Negative - Cancel task', function(done) {
        agent
            .put(`/api/v1/user-tasks/${getTestData('Task')}/cancel`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('68 - Negative - Delete task', function(done) {
        
        agent
            .delete(`/api/v1/user-tasks/${getTestData('Task')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

