import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient goal tests', function() {

    var agent = request.agent(infra._app);

    it('72 - Create patient goal', function(done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData("PatientGoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('73 - Get patient goal by id', function(done) {

        agent
            .get(`/api/v1/patient-goals/${getTestData('PatientGoalId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('74 - Search patient goal records', function(done) {
        loadPatientGoalQueryString();
        agent
            .get(`/api/v1/patient-goals/search${loadPatientGoalQueryString()}`)
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

    it('75 - Update patient goal', function(done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData("PatientGoalUpdateModel");
        agent
            .put(`/api/v1/patient-goals/${getTestData('PatientGoalId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('76 - Delete patient goal', function(done) {
       
        agent
            .delete(`/api/v1/patient-goals/${getTestData('PatientGoalId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientGoalCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Title         : "Daily walk",
        CarePlanId    : "1",
        TypeCode      : "1",
        TypeName      : "Name",
        GoalAchieved  : true,
        GoalAbandoned : false
  
    };
    setTestData(model, "PatientGoalCreateModel");
};

export const loadPatientGoalUpdateModel = async (
) => {
    const model = {
        Title : "Daily walk for 25 min."
    
    };
    setTestData(model, "PatientGoalUpdateModel");
};

export const loadEmergencyContactUpdateModel = async (
) => {
    const model = {
        IsAvailableForEmergency : false,
        TimeOfAvailability      : "10:00 AM to 7:00 PM",
        Description             : "Some another description here",
        AdditionalPhoneNumbers  : "+91-1231231233"
  
    };
    setTestData(model, "EmergencyContactUpdateModel");
};

function loadPatientGoalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?goalAbandoned=false';
    return queryString;
}
