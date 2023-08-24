import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative User device detail tests', function() {

    var agent = request.agent(infra._app);

    it('62 - Negative - Create user device detail', function(done) {
        loadUserDeviceDetailCreateModel();
        const createModel = getTestData("UserDeviceDetailCreate");
        agent
            .post(`/api/v1/user-device-details/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC3PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadUserDeviceDetailCreateModel = async (
) => {
    const model = {
        Token      : "abcds",
        UserId     : getTestData("PatientUserId"),
        DeviceName : "Iphone13",
        OSType     : "aaa",
        OSVersion  : "14.2",
        AppName    : "Reancare",
        AppVersion : "1.2.0"
  
    };
    setTestData(model, "UserDeviceDetailCreateModel");
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
