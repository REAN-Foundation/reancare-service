import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Action plan tests', function() {

    var agent = request.agent(infra._app);

    it('218 - Negative - Create action plan', function(done) {
        loadActionPlanCreateModel();
        const createModel = getTestData("ActionPlanCreateModel");
        agent
            .post(`/api/v1/action-plans/`)
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

    it('219 - Negative - Get selected action plans', function(done) {
     
        agent
            .get(`/api/v1/action-plans/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(403, done);
    });

    it('220 - Negative - Update action plan', function(done) {
        loadActionPlanUpdateModel();
        const updateModel = getTestData("ActionPlanUpdateModel");
        agent
            .put(`/api/v1/action-plans/${getTestData('ActionPlan')}`)
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

});

///////////////////////////////////////////////////////////////////////////

export const loadActionPlanCreateModel = async (
) => {
    const model = {
       
    };
    setTestData(model, "ActionPlanCreateModel");
};

export const loadActionPlanUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Source               : "Self",
        ProviderEnrollmentId : "34",
        Provider             : "AHA",
        ProviderCareplanName : "reancare",
        ProviderCareplanCode : "Code",
        GoalId               : getTestData("GoalId"),
        Title                : "Monitor blood pressure",
        ScheduledEndDate     : "2021-10-12T00:00:00.000Z"
    };
    setTestData(model, "ActionPlanUpdateModel");
};
