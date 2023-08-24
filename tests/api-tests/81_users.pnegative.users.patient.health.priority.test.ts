import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Health priority tests', function() {

    var agent = request.agent(infra._app);

    it('211 - Negative - Create health priority', function(done) {
        loadPriorityCreateModel();
        const createModel = getTestData("PriorityCreateModel");
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('212 - Negative - Search health priority records', function(done) {
        loadPriorityQueryString();
        agent
            .get(`/api/v1/patient-health-priorities/search${loadPriorityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('213 - Negative - Delete health priority', function(done) {
        
        agent
            .delete(`/api/v1/patient-health-priorities/${getTestData('HealthPriority')}`)
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

export const loadPriorityCreateModel = async (
) => {
    const model = {
        
    };
    setTestData(model, "PriorityCreateModel");
};

export const loadPriorityUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Provider             : "AHA",
        Source               : "Careplan",
        ProviderEnrollmentId : "34",
        ProviderCareplanCode : "careplancode",
        ProviderCareplanName : "reancare",
        HealthPriorityType   : "Tobacco",
        IsPrimary            : true
    };
    setTestData(model, "PriorityUpdateModel");
};

function loadPriorityQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?provider=AHA';
    return queryString;
}
