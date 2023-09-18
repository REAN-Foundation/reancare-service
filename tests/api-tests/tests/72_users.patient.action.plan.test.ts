import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('72 - Action plan tests', function() {

    var agent = request.agent(infra._app);

    it('72:01 -> Create action plan', function(done) {
        loadActionPlanCreateModel();
        const createModel = getTestData("ActionPlanCreateModel");
        agent
            .post(`/api/v1/action-plans/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ActionPlan.id, 'ActionPlanId_1');
                expect(response.body.Data.ActionPlan).to.have.property('PatientUserId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanName');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.ActionPlan).to.have.property('GoalId');
                expect(response.body.Data.ActionPlan).to.have.property('Title');
                expect(response.body.Data.ActionPlan).to.have.property('ScheduledEndDate');
               
                setTestData(response.body.Data.ActionPlan.id, 'ActionPlanId_1');

                expect(response.body.Data.ActionPlan.PatientUserId).to.equal(getTestData("ActionPlanCreateModel").PatientUserId);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanCreateModel").Provider);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanCreateModel").Provider);
                expect(response.body.Data.ActionPlan.ProviderCareplanName).to.equal(getTestData("ActionPlanCreateModel").ProviderCareplanName);
                expect(response.body.Data.ActionPlan.ProviderCareplanCode).to.equal(getTestData("ActionPlanCreateModel").ProviderCareplanCode);
                expect(response.body.Data.ActionPlan.GoalId).to.equal(getTestData("ActionPlanCreateModel").GoalId);
                expect(response.body.Data.ActionPlan.Title).to.equal(getTestData("ActionPlanCreateModel").Title);

            })
            .expect(201, done);
    });

    it('72:02 -> Get selected action plans', function(done) {
     
        agent
            .get(`/api/v1/action-plans/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                
            })
            .expect(200, done);
    });

    it('72:03 -> Search action plan records', function(done) {
        loadActionPlanQueryString();
        agent
            .get(`/api/v1/action-plans/search${loadActionPlanQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.ActionPlanRecords).to.have.property('TotalCount');
                expect(response.body.Data.ActionPlanRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.ActionPlanRecords).to.have.property('PageIndex');
                expect(response.body.Data.ActionPlanRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.ActionPlanRecords).to.have.property('Order');
                expect(response.body.Data.ActionPlanRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.ActionPlanRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.ActionPlanRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('72:04 -> Update action plan', function(done) {
        loadActionPlanUpdateModel();
        const updateModel = getTestData("ActionPlanUpdateModel");
        agent
            .put(`/api/v1/action-plans/${getTestData('ActionPlanId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.ActionPlan).to.have.property('PatientUserId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanName');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.ActionPlan).to.have.property('GoalId');
                expect(response.body.Data.ActionPlan).to.have.property('Title');
                expect(response.body.Data.ActionPlan).to.have.property('ScheduledEndDate');

                expect(response.body.Data.ActionPlan.PatientUserId).to.equal(getTestData("ActionPlanUpdateModel").PatientUserId);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanUpdateModel").Provider);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanUpdateModel").Provider);
                expect(response.body.Data.ActionPlan.ProviderCareplanName).to.equal(getTestData("ActionPlanUpdateModel").ProviderCareplanName);
                expect(response.body.Data.ActionPlan.ProviderCareplanCode).to.equal(getTestData("ActionPlanUpdateModel").ProviderCareplanCode);
                expect(response.body.Data.ActionPlan.GoalId).to.equal(getTestData("ActionPlanUpdateModel").GoalId);
                expect(response.body.Data.ActionPlan.Title).to.equal(getTestData("ActionPlanUpdateModel").Title);

            })
            .expect(200, done);
    });

    it('72:05 -> Delete action plan', function(done) {
        
        agent
            .delete(`/api/v1/action-plans/${getTestData('ActionPlanId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create action plan again', function(done) {
        loadActionPlanCreateModel();
        const createModel = getTestData("ActionPlanCreateModel");
        agent
            .post(`/api/v1/action-plans/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ActionPlan.id, 'ActionPlanId');
                expect(response.body.Data.ActionPlan).to.have.property('PatientUserId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.ActionPlan).to.have.property('Provider');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanName');
                expect(response.body.Data.ActionPlan).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.ActionPlan).to.have.property('GoalId');
                expect(response.body.Data.ActionPlan).to.have.property('Title');
                expect(response.body.Data.ActionPlan).to.have.property('ScheduledEndDate');
             
                setTestData(response.body.Data.ActionPlan.id, 'ActionPlanId');

                expect(response.body.Data.ActionPlan.PatientUserId).to.equal(getTestData("ActionPlanCreateModel").PatientUserId);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanCreateModel").Provider);
                expect(response.body.Data.ActionPlan.Provider).to.equal(getTestData("ActionPlanCreateModel").Provider);
                expect(response.body.Data.ActionPlan.ProviderCareplanName).to.equal(getTestData("ActionPlanCreateModel").ProviderCareplanName);
                expect(response.body.Data.ActionPlan.ProviderCareplanCode).to.equal(getTestData("ActionPlanCreateModel").ProviderCareplanCode);
                expect(response.body.Data.ActionPlan.GoalId).to.equal(getTestData("ActionPlanCreateModel").GoalId);
                expect(response.body.Data.ActionPlan.Title).to.equal(getTestData("ActionPlanCreateModel").Title);

            })
            .expect(201, done);
    });

    it('72:06 -> Negative - Create action plan', function(done) {
        loadNegativeActionPlanCreateModel();
        const createModel = getTestData("NegativeActionPlanCreateModel");
        agent
            .post(`/api/v1/action-plans/`)
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

    it('72:07 -> Negative - Get selected action plans', function(done) {
     
        agent
            .get(`/api/v1/action-plans/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('72:08 -> Negative - Update action plan', function(done) {
        loadActionPlanUpdateModel();
        const updateModel = getTestData("ActionPlanUpdateModel");
        agent
            .put(`/api/v1/action-plans/${getTestData('ActionPlanId_1')}`)
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

});

///////////////////////////////////////////////////////////////////////////

export const loadActionPlanCreateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Source               : faker.lorem.word(),
        ProviderEnrollmentId : faker.number.int(500),
        Provider             : faker.lorem.word(),
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        GoalId               : getTestData("GoalId"),
        Title                : faker.lorem.words(5),
        ScheduledEndDate     : faker.date.anytime()
    };
    setTestData(model, "ActionPlanCreateModel");
};

export const loadActionPlanUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Source               : faker.lorem.word(),
        ProviderEnrollmentId : faker.number.int(500),
        Provider             : faker.lorem.word(),
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        GoalId               : getTestData("GoalId"),
        Title                : faker.lorem.words(5),
        ScheduledEndDate     : faker.date.anytime()
    };
    setTestData(model, "ActionPlanUpdateModel");
};

function loadActionPlanQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeActionPlanCreateModel = async (
) => {
    const model = {
        Provider             : faker.lorem.word(),
        ProviderCareplanName : faker.lorem.word(),
        ProviderCareplanCode : faker.lorem.word(),
        GoalId               : getTestData("GoalId"),
        Title                : faker.lorem.words(5),
        ScheduledEndDate     : faker.date.anytime()
    };
    setTestData(model, "NegativeActionPlanCreateModel");
};
