import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient emergency contact tests', function() {

    var agent = request.agent(infra._app);

    it('27 - Negative - Get contact person role', function(done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/roles/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('28 - Negative - Create emergency contact', function(done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData("EmergencyContactCreateModel");
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('29 - Negative - Get emergency contact by id', function(done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/${getTestData('EmergencyContact')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('30 - Negative - Search emergency contact records', function(done) {
        loadEmergencyContactQueryString();
        agent
            .get(`/api/v1/patient-emergency-contacts/search${loadEmergencyContactQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadEmergencyContactCreateModel = async (
) => {
    const model = {
        PatientUserId           : getTestData("PatientUserId"),
        ContactPersonId         : getTestData("PatientPersonId"),
        ContactRelation         : "Doctor",
        AddressId               : getTestData("AddressId"),
        IsAvailableForEmergency : true,
        TimeOfAvailability      : "10:00 AM - 5:00 PM",
        Description             : "Some description here",
        AdditionalPhoneNumbers  : "+91-3243243334"
  
    };
    setTestData(model, "EmergencyContactCreateModel");
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

function loadEmergencyContactQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?isAvailableForEmergency=true';
    return queryString;
}
