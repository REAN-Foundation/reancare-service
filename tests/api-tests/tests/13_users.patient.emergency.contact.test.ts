import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('13 - Patient emergency contact tests', function() {

    var agent = request.agent(infra._app);

    it('13:01 -> Get contact person role', function(done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/roles/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('13:02 -> Create emergency contact', function(done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData("EmergencyContactCreateModel");
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.EmergencyContact.id, 'EmergencyContactId_1');
                expect(response.body.Data.EmergencyContact).to.have.property('id');
                expect(response.body.Data.EmergencyContact).to.have.property('PatientUserId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactPersonId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactRelation');
                expect(response.body.Data.EmergencyContact).to.have.property('AddressId');
                expect(response.body.Data.EmergencyContact).to.have.property('IsAvailableForEmergency');
                expect(response.body.Data.EmergencyContact).to.have.property('TimeOfAvailability');
                expect(response.body.Data.EmergencyContact).to.have.property('Description');
                expect(response.body.Data.EmergencyContact).to.have.property('AdditionalPhoneNumbers');

                setTestData(response.body.Data.EmergencyContact.id, 'EmergencyContactId_1');

                expect(response.body.Data.EmergencyContact.PatientUserId).to.equal(getTestData("EmergencyContactCreateModel").PatientUserId);
                expect(response.body.Data.EmergencyContact.ContactPersonId).to.equal(getTestData("EmergencyContactCreateModel").ContactPersonId);
                expect(response.body.Data.EmergencyContact.ContactRelation).to.equal(getTestData("EmergencyContactCreateModel").ContactRelation);
                expect(response.body.Data.EmergencyContact.AddressId).to.equal(getTestData("EmergencyContactCreateModel").AddressId);
                expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(getTestData("EmergencyContactCreateModel").IsAvailableForEmergency);
                expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(getTestData("EmergencyContactCreateModel").TimeOfAvailability);
                expect(response.body.Data.EmergencyContact.Description).to.equal(getTestData("EmergencyContactCreateModel").Description);
                expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(getTestData("EmergencyContactCreateModel").AdditionalPhoneNumbers);

            })
            .expect(201, done);
    });

    it('13:03 -> Get emergency contact by id', function(done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/${getTestData('EmergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.EmergencyContact).to.have.property('id');
                expect(response.body.Data.EmergencyContact).to.have.property('PatientUserId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactPersonId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactRelation');
                expect(response.body.Data.EmergencyContact).to.have.property('AddressId');
                expect(response.body.Data.EmergencyContact).to.have.property('IsAvailableForEmergency');
                expect(response.body.Data.EmergencyContact).to.have.property('TimeOfAvailability');
                expect(response.body.Data.EmergencyContact).to.have.property('Description');
                expect(response.body.Data.EmergencyContact).to.have.property('AdditionalPhoneNumbers');

                expect(response.body.Data.EmergencyContact.PatientUserId).to.equal(getTestData("EmergencyContactCreateModel").PatientUserId);
                expect(response.body.Data.EmergencyContact.ContactPersonId).to.equal(getTestData("EmergencyContactCreateModel").ContactPersonId);
                expect(response.body.Data.EmergencyContact.ContactRelation).to.equal(getTestData("EmergencyContactCreateModel").ContactRelation);
                expect(response.body.Data.EmergencyContact.AddressId).to.equal(getTestData("EmergencyContactCreateModel").AddressId);
                expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(getTestData("EmergencyContactCreateModel").IsAvailableForEmergency);
                expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(getTestData("EmergencyContactCreateModel").TimeOfAvailability);
                expect(response.body.Data.EmergencyContact.Description).to.equal(getTestData("EmergencyContactCreateModel").Description);
                expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(getTestData("EmergencyContactCreateModel").AdditionalPhoneNumbers);
            })
            .expect(200, done);
    });

    it('13:04 -> Search emergency contact records', function(done) {
        loadEmergencyContactQueryString();
        agent
            .get(`/api/v1/patient-emergency-contacts/search${loadEmergencyContactQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.EmergencyContacts).to.have.property('TotalCount');
                expect(response.body.Data.EmergencyContacts).to.have.property('RetrievedCount');
                expect(response.body.Data.EmergencyContacts).to.have.property('PageIndex');
                expect(response.body.Data.EmergencyContacts).to.have.property('ItemsPerPage');
                expect(response.body.Data.EmergencyContacts).to.have.property('Order');
                expect(response.body.Data.EmergencyContacts.TotalCount).to.greaterThan(0);
                expect(response.body.Data.EmergencyContacts.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.EmergencyContacts.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('13:05 -> Update emergency contact', function(done) {
        loadEmergencyContactUpdateModel();
        const updateModel = getTestData("EmergencyContactUpdateModel");
        agent
            .put(`/api/v1/patient-emergency-contacts/${getTestData('EmergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.EmergencyContact).to.have.property('id');
                expect(response.body.Data.EmergencyContact).to.have.property('IsAvailableForEmergency');
                expect(response.body.Data.EmergencyContact).to.have.property('TimeOfAvailability');
                expect(response.body.Data.EmergencyContact).to.have.property('Description');
                expect(response.body.Data.EmergencyContact).to.have.property('AdditionalPhoneNumbers');

                expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(getTestData("EmergencyContactUpdateModel").IsAvailableForEmergency);
                expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(getTestData("EmergencyContactUpdateModel").TimeOfAvailability);
                expect(response.body.Data.EmergencyContact.Description).to.equal(getTestData("EmergencyContactUpdateModel").Description);
                expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(getTestData("EmergencyContactUpdateModel").AdditionalPhoneNumbers);
            })
            .expect(200, done);
    });

    it('13:06 -> Delete emergency contact', function(done) {

        agent
            .delete(`/api/v1/patient-emergency-contacts/${getTestData('EmergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create emergency contact again', function(done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData("EmergencyContactCreateModel");
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.EmergencyContact.id, 'EmergencyContactId');
                expect(response.body.Data.EmergencyContact).to.have.property('id');
                expect(response.body.Data.EmergencyContact).to.have.property('PatientUserId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactPersonId');
                expect(response.body.Data.EmergencyContact).to.have.property('ContactRelation');
                expect(response.body.Data.EmergencyContact).to.have.property('AddressId');
                expect(response.body.Data.EmergencyContact).to.have.property('IsAvailableForEmergency');
                expect(response.body.Data.EmergencyContact).to.have.property('TimeOfAvailability');
                expect(response.body.Data.EmergencyContact).to.have.property('Description');
                expect(response.body.Data.EmergencyContact).to.have.property('AdditionalPhoneNumbers');

                setTestData(response.body.Data.EmergencyContact.id, 'EmergencyContactId');

                expect(response.body.Data.EmergencyContact.PatientUserId).to.equal(getTestData("EmergencyContactCreateModel").PatientUserId);
                expect(response.body.Data.EmergencyContact.ContactPersonId).to.equal(getTestData("EmergencyContactCreateModel").ContactPersonId);
                expect(response.body.Data.EmergencyContact.ContactRelation).to.equal(getTestData("EmergencyContactCreateModel").ContactRelation);
                expect(response.body.Data.EmergencyContact.AddressId).to.equal(getTestData("EmergencyContactCreateModel").AddressId);
                expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(getTestData("EmergencyContactCreateModel").IsAvailableForEmergency);
                expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(getTestData("EmergencyContactCreateModel").TimeOfAvailability);
                expect(response.body.Data.EmergencyContact.Description).to.equal(getTestData("EmergencyContactCreateModel").Description);
                expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(getTestData("EmergencyContactCreateModel").AdditionalPhoneNumbers);

            })
            .expect(201, done);
    });

    it('13:07 -> Negative - Get contact person role', function(done) {
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

    it('13:08 -> Negative - Create emergency contact', function(done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData("EmergencyContactCreateModel");
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('13:09 -> Negative - Get emergency contact by id', function(done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/${getTestData('EmergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('13:10 -> Negative - Search emergency contact records', function(done) {
        loadEmergencyContactQueryString();
        agent
            .get(`/api/v1/patient-emergency-contacts/search${loadEmergencyContactQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
        ContactRelation         : faker.lorem.word(),
        AddressId               : getTestData("AddressId"),
        IsAvailableForEmergency : faker.datatype.boolean(),
        TimeOfAvailability      : "10:00 AM - 5:00 PM",
        Description             : faker.word.words(5),
        AdditionalPhoneNumbers  : faker.phone.number('+91-##########')
    };
    setTestData(model, "EmergencyContactCreateModel");
};

export const loadEmergencyContactUpdateModel = async (
) => {
    const model = {
        IsAvailableForEmergency : faker.datatype.boolean(),
        TimeOfAvailability      : "10:00 AM to 7:00 PM",
        Description             : faker.word.words(5),
        AdditionalPhoneNumbers  : faker.phone.number('+91-##########')
  
    };
    setTestData(model, "EmergencyContactUpdateModel");
};

function loadEmergencyContactQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
