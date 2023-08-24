import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Emergency event tests', function() {

    var agent = request.agent(infra._app);

    it('126 - Negative - Create emergency event', function(done) {
        loadEmergencyEventCreateModel();
        const createModel = getTestData("EmergencyEventCreateModel");
        agent
            .post(`/api/v1/clinical/emergency-events/`)
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

    it('127 - Negative - Search emergency event records', function(done) {
        loadEmergencyEventQueryString();
        agent
            .get(`/api/v1/clinical/emergency-events/search${loadEmergencyEventQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('128 - Negative - Delete emergency event', function(done) {
        
        agent
            .delete(`/api/v1/clinical/emergency-events/${getTestData('EmergencyEvent')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadEmergencyEventCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "EmergencyEventCreateModel");
};

export const loadEmergencyEventUpdateModel = async (
) => {
    const model = {
        EhrId         : "96",
        PatientUserId : getTestData("PatientUserId"),
        Details       : "Emergency Events details",
        EmergencyDate : "2023-10-11T00:00:00.000Z"

    };
    setTestData(model, "EmergencyEventUpdateModel");
};

function loadEmergencyEventQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?EmergencyDateFrom=2023-05-1';
    return queryString;
}
