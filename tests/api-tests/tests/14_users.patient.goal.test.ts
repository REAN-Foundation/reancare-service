import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('14 - Patient goal tests', function () {
    var agent = request.agent(infra._app);

    it('14:01 -> Create patient goal', function (done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData('patientGoalCreateModel');
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setGoalId(response, 'patientGoalId_1');
                expectGoalProperties(response);

                expectGoalPropertyValues(response);
            })
            .expect(201, done);
    });

    it('14:02 -> Get patient goal by id', function (done) {
        agent
            .get(`/api/v1/patient-goals/${getTestData('patientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectGoalProperties(response);

                expectGoalPropertyValues(response);
            })
            .expect(200, done);
    });

    it('14:03 -> Search patient goal records', function (done) {
        loadPatientGoalQueryString();
        agent
            .get(`/api/v1/patient-goals/search${loadPatientGoalQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.GoalRecords).to.have.property('TotalCount');
                expect(response.body.Data.GoalRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.GoalRecords).to.have.property('PageIndex');
                expect(response.body.Data.GoalRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.GoalRecords).to.have.property('Order');
                expect(response.body.Data.GoalRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.GoalRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.GoalRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('14:04 -> Update patient goal', function (done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData('patientGoalUpdateModel');
        agent
            .put(`/api/v1/patient-goals/${getTestData('patientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectGoalProperties(response);

                expect(response.body.Data.Goal.Title).to.equal(getTestData('patientGoalUpdateModel').Title);
            })
            .expect(200, done);
    });

    it('14:05 -> Delete patient goal', function (done) {
        agent
            .delete(`/api/v1/patient-goals/${getTestData('patientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create patient goal again', function (done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData('patientGoalCreateModel');
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setGoalId(response, 'patientGoalId');
                expectGoalProperties(response);

                expectGoalPropertyValues(response);
            })
            .expect(201, done);
    });

    it('14:06 -> Negative - Create patient goal', function (done) {
        loadNegativePatientGoalCreateModel();
        const createModel = getTestData('negativePatientGoalCreateModel');
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('14:07 -> Negative - Update patient goal', function (done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData('patientGoalUpdateModel');
        agent
            .put(`/api/v1/patient-goals/${getTestData('patientGoalId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('14:08 -> Negative - Delete patient goal', function (done) {
        agent
            .delete(`/api/v1/patient-goals/${getTestData('patientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setGoalId(response, key) {
    setTestData(response.body.Data.Goal.id, key);
}

function expectGoalProperties(response) {
    expect(response.body.Data.Goal).to.have.property('id');
    expect(response.body.Data.Goal).to.have.property('PatientUserId');
    expect(response.body.Data.Goal).to.have.property('Title');
    expect(response.body.Data.Goal).to.have.property('GoalAchieved');
    expect(response.body.Data.Goal).to.have.property('GoalAbandoned');
}

function expectGoalPropertyValues(response) {
    expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData('patientGoalCreateModel').PatientUserId);
    expect(response.body.Data.Goal.Title).to.equal(getTestData('patientGoalCreateModel').Title);
    expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData('patientGoalCreateModel').GoalAchieved);
    expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData('patientGoalCreateModel').GoalAbandoned);
}

export const loadPatientGoalCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Title: faker.lorem.word(),
        CarePlanId: faker.string.uuid(),
        TypeCode: faker.string.uuid(),
        TypeName: faker.company.name(),
        GoalAchieved: faker.datatype.boolean(),
        GoalAbandoned: faker.datatype.boolean(),
    };
    setTestData(model, 'patientGoalCreateModel');
};

export const loadPatientGoalUpdateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
    };
    setTestData(model, 'patientGoalUpdateModel');
};

function loadPatientGoalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativePatientGoalCreateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
        CarePlanId: faker.string.uuid(),
        TypeCode: faker.string.uuid(),
        TypeName: faker.company.name(),
        GoalAchieved: faker.datatype.boolean(),
        GoalAbandoned: faker.datatype.boolean(),
    };
    setTestData(model, 'negativePatientGoalCreateModel');
};
