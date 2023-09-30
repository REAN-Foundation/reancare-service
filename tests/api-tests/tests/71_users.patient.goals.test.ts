import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('71 - Health priority tests', function() {

    var agent = request.agent(infra._app);

    it('71:01 -> Get patient goals', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('71:02 -> Create goal', function(done) {
        loadGoalCreateModel();
        const createModel = getTestData("GoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Goal.id, 'GoalId_1');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Goal).to.have.property('Provider');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanName');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('Sequence');
                expect(response.body.Data.Goal).to.have.property('HealthPriorityId');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                setTestData(response.body.Data.Goal.id, 'GoalId_1');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("GoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);
            })
            .expect(201, done);
    });

    it('71:03 -> Get goal by id', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/${getTestData('GoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Goal).to.have.property('Provider');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanName');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('Sequence');
                expect(response.body.Data.Goal).to.have.property('HealthPriorityId');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("GoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);
                
            })
            .expect(200, done);
    });

    it('71:04 -> Search goal records', function(done) {
        loadGoalQueryString();
        agent
            .get(`/api/v1/patient-goals/search${loadGoalQueryString()}`)
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

    it('71:05 -> Delete goal', function(done) {
        
        agent
            .delete(`/api/v1/patient-goals/${getTestData('GoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create goal again', function(done) {
        loadGoalCreateModel();
        const createModel = getTestData("GoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Goal.id, 'GoalId');
                expect(response.body.Data.Goal).to.have.property('PatientUserId');
                expect(response.body.Data.Goal).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Goal).to.have.property('Provider');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanName');
                expect(response.body.Data.Goal).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.Goal).to.have.property('Title');
                expect(response.body.Data.Goal).to.have.property('Sequence');
                expect(response.body.Data.Goal).to.have.property('HealthPriorityId');
                expect(response.body.Data.Goal).to.have.property('GoalAchieved');
                expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

                setTestData(response.body.Data.Goal.id, 'GoalId');

                expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("GoalCreateModel").PatientUserId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);

            })
            .expect(201, done);
    });

    it('71:06 -> Negative - Get patient goals', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

    it('71:07 -> Negative - Create goal', function(done) {
        loadNegativeGoalCreateModel();
        const createModel = getTestData("NegativeGoalCreateModel");
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

    it('71:08 -> Negative - Get goal by id', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/${getTestData('GoalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('71:09 -> Negative - Delete goal', function(done) {
        
        agent
            .delete(`/api/v1/patient-goals/${getTestData('GoalId_1')}`)
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

export const loadGoalCreateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        ProviderEnrollmentId : faker.number.int(500),
        Provider             : faker.lorem.word(),
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        Title                : faker.lorem.word(),
        Sequence             : faker.number.int(10),
        HealthPriorityId     : getTestData("HealthPriorityId"),
        GoalAchieved         : faker.datatype.boolean(),
        GoalAbandoned        : faker.datatype.boolean()
    };
    setTestData(model, "GoalCreateModel");
};

export const loadGoalUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        ProviderEnrollmentId : faker.number.int(500),
        Provider             : faker.lorem.word(),
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        Title                : faker.lorem.word(),
        Sequence             : faker.number.int(10),
        HealthPriorityId     : getTestData("HealthPriorityId"),
        GoalAchieved         : faker.datatype.boolean(),
        GoalAbandoned        : faker.datatype.boolean()
    };
    setTestData(model, "GoalUpdateModel");
};

function loadGoalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeGoalCreateModel = async (
) => {
    const model = {
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        Title                : faker.lorem.word(),
        Sequence             : faker.number.int(10),
        HealthPriorityId     : getTestData("HealthPriorityId"),
        GoalAchieved         : faker.datatype.boolean(),
        GoalAbandoned        : faker.datatype.boolean()
           
    };
    setTestData(model, "NegativeGoalCreateModel");
};
