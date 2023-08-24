import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient goal tests', function() {

    var agent = request.agent(infra._app);

    it('31 - Negative - Create patient goal', function(done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData("PatientGoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-RGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('32 - Negative - Update patient goal', function(done) {
        loadPatientGoalUpdateModel();
        const updateModel = getTestData("PatientGoalUpdateModel");
        agent
            .put(`/api/v1/patient-goals/${getTestData('PatientGoal')}`)
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

    it('33 - Negative - Delete patient goal', function(done) {
       
        agent
            .delete(`/api/v1/patient-goals/${getTestData('PatientGoalId')}`)
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

