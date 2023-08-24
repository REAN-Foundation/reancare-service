import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Health priority tests', function() {

    var agent = request.agent(infra._app);

    it('214 - Negative - Get patient goals', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

    it('215 - Negative - Create goal', function(done) {
        loadGoalCreateModel();
        const createModel = getTestData("GoalCreateModel");
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('216 - Negative - Get goal by id', function(done) {
     
        agent
            .get(`/api/v1/patient-goals/${getTestData('Goal')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('217 - Negative - Delete goal', function(done) {
        
        agent
            .delete(`/api/v1/patient-goals/${getTestData('Goal')}`)
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

export const loadGoalCreateModel = async (
) => {
    const model = {
        
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
