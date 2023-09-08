import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';
import { UserTaskCategory } from '../../src/domain.types/users/user.task/user.task.types';
import { getRandomEnumValue } from './utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('24 - Patient custom task tests', function() {

    var agent = request.agent(infra._app);

    it('24 - 01 - Create patient custom task', function(done) {
        loadPatientCustomTaskCreateModel();
        const createModel = getTestData("PatientCustomTaskCreateModel");
        agent
            .post(`/api/v1/custom-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.UserTask.IsRecurrent).to.equal(getTestData("PatientCustomTaskCreateModel").IsRecurrent);

            })
            .expect(201, done);
    });

    // it('24 - 02 - Get patient custom task by id', function(done) {
    //     const id = `${getTestData('PatientCustomTaskId')}`;
    //     agent
    //         .get(`/api/v1/custom-tasks/${getTestData('PatientCustomTaskId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    // it('24 - 03 - Update patient custom task', function(done) {
    //     loadPatientCustomTaskUpdateModel();
    //     const updateModel = getTestData("PatientCustomTaskUpdateModel");
    //     agent
    //         .put(`/api/v1/custom-tasks/${getTestData('PatientCustomTaskId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('24 - 01 - Negative - Create patient custom task', function(done) {
        loadNegativePatientCustomTaskCreateModel();
        const createModel = getTestData("NegativePatientCustomTaskModel");
        agent
            .post(`/api/v1/custom-tasks/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
    Task = faker.lorem.word(),
    Description = faker.lorem.words(10),
    exerciseType = faker.lorem.word(),
    intensityLevel = faker.lorem.word(),
    scheduledStartTime = faker.date.anytime(),
    isRecurrent = faker.datatype.boolean()
) => {
    const model = {
        UserId      : getTestData("PatientUserId"),
        Task        : Task,
        Description : Description,
        Category    : Category,
        Details     : {
            ExerciseType   : exerciseType,
            IntensityLevel : intensityLevel
        },
        ScheduledStartTime : scheduledStartTime,
        IsRecurrent        : false
  
    };
    setTestData(model, "PatientCustomTaskCreateModel");
};

export const loadPatientCustomTaskUpdateModel = async (
    Task = faker.lorem.word(),
    Description = faker.lorem.words(10),
    exerciseType = faker.lorem.word(),
    intensityLevel = faker.lorem.word(),
    scheduledStartTime = faker.date.anytime(),
    isRecurrent = faker.datatype.boolean()
) => {
    const model = {
        UserId      : getTestData("PatientUserId"),
        Task        : Task,
        Description : Description,
        Category    : Category,
        Details     : {
            ExerciseType   : exerciseType,
            IntensityLevel : intensityLevel
        },
        ScheduledStartTime : scheduledStartTime,
        IsRecurrent        : false
    
    };
    setTestData(model, "PatientCustomTaskUpdateModel");
};

export const loadNegativePatientCustomTaskCreateModel = async (
    Task = faker.lorem.word(),
    Description = faker.lorem.words(10),
    exerciseType = faker.lorem.word(),
    intensityLevel = faker.lorem.word(),
    scheduledStartTime = faker.date.anytime(),
    isRecurrent = faker.datatype.boolean()
) => {
    const model = {
        Task        : Task,
        Description : Description,
        Category    : Category,
        Details     : {
            ExerciseType   : exerciseType,
            IntensityLevel : intensityLevel
        },
        ScheduledStartTime : scheduledStartTime,
        IsRecurrent        : isRecurrent
  
    };
    setTestData(model, "NegativePatientCustomTaskCreateModel");
};

const Category = getRandomEnumValue(UserTaskCategory);

