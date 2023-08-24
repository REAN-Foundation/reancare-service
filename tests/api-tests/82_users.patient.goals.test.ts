import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Health priority tests', function() {

    var agent = request.agent(infra._app);

    // it('378 - Get goals by priorities', function(done) {
     
    //     agent
    //         .get(`/api/v1/patient-goals/by-priority/${getTestData('HealthPriorityId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
                
    //         })
    //         .expect(200, done);
    // });

    it('379 - Get patient goals', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('380 - Create goal', function(done) {
        loadGoalCreateModel();
        const createModel = getTestData("GoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Goal.ProviderEnrollmentId).to.equal(getTestData("GoalCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.Sequence).to.equal(getTestData("GoalCreateModel").Sequence);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("GoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("GoalCreateModel").GoalAbandoned);

            })
            .expect(201, done);
    });

    it('381 - Get goal by id', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/${getTestData('GoalId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Goal.ProviderEnrollmentId).to.equal(getTestData("GoalCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.Sequence).to.equal(getTestData("GoalCreateModel").Sequence);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("GoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("GoalCreateModel").GoalAbandoned);
                
            })
            .expect(200, done);
    });

    it('382 - Search goal records', function(done) {
        loadGoalQueryString();
        agent
            .get(`/api/v1/patient-goals/search${loadGoalQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    // it('383 - Update goal', function(done) {
    //     loadGoalUpdateModel();
    //     const updateModel = getTestData("GoalUpdateModel");
    //     agent
    //         .put(`/api/v1/patient-goals/${getTestData('GoalId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(updateModel)
    //         .expect(response => {
    //             expect(response.body.Data.Goal).to.have.property('PatientUserId');
    //             expect(response.body.Data.Goal).to.have.property('ProviderEnrollmentId');
    //             expect(response.body.Data.Goal).to.have.property('Provider');
    //             expect(response.body.Data.Goal).to.have.property('ProviderCareplanName');
    //             expect(response.body.Data.Goal).to.have.property('ProviderCareplanCode');
    //             expect(response.body.Data.Goal).to.have.property('Title');
    //             expect(response.body.Data.Goal).to.have.property('Sequence');
    //             expect(response.body.Data.Goal).to.have.property('HealthPriorityId');
    //             expect(response.body.Data.Goal).to.have.property('GoalAchieved');
    //             expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

    //             expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("GoalUpdateModel").PatientUserId);
    // eslint-disable-next-line max-len
    //             expect(response.body.Data.Goal.ProviderEnrollmentId).to.equal(getTestData("GoalUpdateModel").ProviderEnrollmentId);
    //             expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalUpdateModel").Provider);
    // eslint-disable-next-line max-len
    //             expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalUpdateModel").ProviderCareplanName);
    // eslint-disable-next-line max-len
    //             expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalUpdateModel").ProviderCareplanCode);
    //             expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalUpdateModel").Title);
    //             expect(response.body.Data.Goal.Sequence).to.equal(getTestData("GoalUpdateModel").Sequence);
    // eslint-disable-next-line max-len
    //             expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalUpdateModel").HealthPriorityId);
    //             expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("GoalUpdateModel").GoalAchieved);
    //             expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("GoalUpdateModel").GoalAbandoned);

    //         })
    //         .expect(200, done);
    // });

    it('384 - Delete goal', function(done) {
        
        agent
            .delete(`/api/v1/patient-goals/${getTestData('GoalId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Goal.ProviderEnrollmentId).to.equal(getTestData("GoalCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.Goal.Provider).to.equal(getTestData("GoalCreateModel").Provider);
                expect(response.body.Data.Goal.ProviderCareplanName).to.equal(getTestData("GoalCreateModel").ProviderCareplanName);
                expect(response.body.Data.Goal.ProviderCareplanCode).to.equal(getTestData("GoalCreateModel").ProviderCareplanCode);
                expect(response.body.Data.Goal.Title).to.equal(getTestData("GoalCreateModel").Title);
                expect(response.body.Data.Goal.Sequence).to.equal(getTestData("GoalCreateModel").Sequence);
                expect(response.body.Data.Goal.HealthPriorityId).to.equal(getTestData("GoalCreateModel").HealthPriorityId);
                expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("GoalCreateModel").GoalAchieved);
                expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("GoalCreateModel").GoalAbandoned);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadGoalCreateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        ProviderEnrollmentId : "34",
        Provider             : "AHA",
        ProviderCareplanName : "rean",
        ProviderCareplanCode : "goal",
        Title                : "Lower systolic blood pressure",
        Sequence             : '0',
        HealthPriorityId     : getTestData("HealthPriorityId"),
        GoalAchieved         : false,
        GoalAbandoned        : false
    };
    setTestData(model, "GoalCreateModel");
};

export const loadGoalUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        ProviderEnrollmentId : "34",
        Provider             : "AHAA",
        ProviderCareplanName : "rean",
        ProviderCareplanCode : "goalcode",
        Title                : "Lower systolic blood pressure",
        Sequence             : '5',
        HealthPriorityId     : getTestData("HealthPriorityId"),
        GoalAchieved         : true,
        GoalAbandoned        : true
    };
    setTestData(model, "GoalUpdateModel");
};

function loadGoalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=Lower systolic blood pressure';
    return queryString;
}
