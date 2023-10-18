import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('14 - Patient goal tests', function() {

    var agent = request.agent(infra._app);

    it('14:01 -> Create patient goal', function(done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData("PatientGoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Goal.id, 'PatientGoalId_1');
                expect(response.body.Data.Goal).to.have.property('id');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                setTestData(response.body.Data.Goal.id, 'PatientGoalId_1');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("PatientGoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalCreateModel").Title);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("PatientGoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("PatientGoalCreateModel").GoalAbandoned);

            })
            .expect(201, done);
    });

    it('14:02 -> Get patient goal by id', function(done) {

        agent
            .get(`/api/v1/patient-goals/${getTestData('PatientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Goal).to.have.property('id');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("PatientGoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalCreateModel").Title);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("PatientGoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("PatientGoalCreateModel").GoalAbandoned);
            })
            .expect(200, done);
    });

    it('14:03 -> Search patient goal records', function(done) {
        loadPatientGoalQueryString();
        agent
            .get(`/api/v1/patient-goals/search${loadPatientGoalQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('14:04 -> Update patient goal', function(done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData("PatientGoalUpdateModel");
        agent
            .put(`/api/v1/patient-goals/${getTestData('PatientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Goal).to.have.property('id');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalUpdateModel").Title);

            })
            .expect(200, done);
    });

    it('14:05 -> Delete patient goal', function(done) {
       
        agent
            .delete(`/api/v1/patient-goals/${getTestData('PatientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create patient goal again', function(done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData("PatientGoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Goal.id, 'PatientGoalId');
                expect(response.body.Data.Goal).to.have.property('id');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                setTestData(response.body.Data.Goal.id, 'PatientGoalId');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("PatientGoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalCreateModel").Title);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("PatientGoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("PatientGoalCreateModel").GoalAbandoned);

            })
            .expect(201, done);
    });

    it('14:06 -> Negative - Create patient goal', function(done) {
        loadNegativePatientGoalCreateModel();
        const createModel = getTestData("NegativePatientGoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('14:07 -> Negative - Update patient goal', function(done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData("PatientGoalUpdateModel");
        agent
            .put(`/api/v1/patient-goals/${getTestData('PatientGoalId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('14:08 -> Negative - Delete patient goal', function(done) {
       
        agent
            .delete(`/api/v1/patient-goals/${getTestData('PatientGoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientGoalCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Title         : faker.lorem.word(),
        CarePlanId    : faker.string.uuid(),
        TypeCode      : faker.string.uuid(),
        TypeName      : faker.company.name(),
        GoalAchieved  : faker.datatype.boolean(),
        GoalAbandoned : faker.datatype.boolean()
  
    };
    setTestData(model, "PatientGoalCreateModel");
};

export const loadPatientGoalUpdateModel = async (
) => {
    const model = {
        Title : faker.lorem.word()
    
    };
    setTestData(model, "PatientGoalUpdateModel");
};

function loadPatientGoalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativePatientGoalCreateModel = async (
) => {
    const model = {
        Title         : faker.lorem.word(),
        CarePlanId    : faker.string.uuid(),
        TypeCode      : faker.string.uuid(),
        TypeName      : faker.company.name(),
        GoalAchieved  : faker.datatype.boolean(),
        GoalAbandoned : faker.datatype.boolean()
      
    };
    setTestData(model, "NegativePatientGoalCreateModel");
};
