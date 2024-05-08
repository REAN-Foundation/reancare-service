import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('13 - Patient emergency contact tests', function () {
    var agent = request.agent(infra._app);

    it('13:01 -> Get contact person role', function (done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/roles/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('13:02 -> Create emergency contact', function (done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData('emergencyContactCreateModel');
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setEmergencyContactId(response, 'emergencyContactId_1');
                expectEmergencyContactProperties(response);

                expectEmergencyContactPropertyValues(response);
            })
            .expect(201, done);
    });

    it('13:03 -> Get emergency contact by id', function (done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/${getTestData('emergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectEmergencyContactProperties(response);

                expectEmergencyContactPropertyValues(response);
            })
            .expect(200, done);
    });

    it('13:04 -> Search emergency contact records', function (done) {
        loadEmergencyContactQueryString();
        agent
            .get(`/api/v1/patient-emergency-contacts/search${loadEmergencyContactQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('13:05 -> Update emergency contact', function (done) {
        loadEmergencyContactUpdateModel();
        const updateModel = getTestData('emergencyContactUpdateModel');
        agent
            .put(`/api/v1/patient-emergency-contacts/${getTestData('emergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectEmergencyContactProperties(response);

                expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(
                    getTestData('emergencyContactUpdateModel').IsAvailableForEmergency
                );
                expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(
                    getTestData('emergencyContactUpdateModel').TimeOfAvailability
                );
                expect(response.body.Data.EmergencyContact.Description).to.equal(
                    getTestData('emergencyContactUpdateModel').Description
                );
                expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(
                    getTestData('emergencyContactUpdateModel').AdditionalPhoneNumbers
                );
            })
            .expect(200, done);
    });

    it('13:06 -> Delete emergency contact', function (done) {
        agent
            .delete(`/api/v1/patient-emergency-contacts/${getTestData('emergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create emergency contact again', function (done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData('emergencyContactCreateModel');
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setEmergencyContactId(response, 'emergencyContactId');
                expectEmergencyContactProperties(response);

                expectEmergencyContactPropertyValues(response);
            })
            .expect(201, done);
    });

    it('13:07 -> Negative - Get contact person role', function (done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/roles/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('13:08 -> Negative - Create emergency contact', function (done) {
        loadEmergencyContactCreateModel();
        const createModel = getTestData('emergencyContactCreateModel');
        agent
            .post(`/api/v1/patient-emergency-contacts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('13:09 -> Negative - Get emergency contact by id', function (done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/${getTestData('emergencyContactId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('13:10 -> Negative - Search emergency contact records', function (done) {
        loadEmergencyContactQueryString();
        agent
            .get(`/api/v1/patient-emergency-contacts/search${loadEmergencyContactQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setEmergencyContactId(response, key) {
    setTestData(response.body.Data.EmergencyContact.id, key);
}

function expectEmergencyContactProperties(response) {
    expect(response.body.Data.EmergencyContact).to.have.property('id');
    expect(response.body.Data.EmergencyContact).to.have.property('PatientUserId');
    expect(response.body.Data.EmergencyContact).to.have.property('ContactPersonId');
    expect(response.body.Data.EmergencyContact).to.have.property('ContactRelation');
    expect(response.body.Data.EmergencyContact).to.have.property('AddressId');
    expect(response.body.Data.EmergencyContact).to.have.property('IsAvailableForEmergency');
    expect(response.body.Data.EmergencyContact).to.have.property('TimeOfAvailability');
    expect(response.body.Data.EmergencyContact).to.have.property('Description');
    expect(response.body.Data.EmergencyContact).to.have.property('AdditionalPhoneNumbers');
}

function expectEmergencyContactPropertyValues(response) {
    expect(response.body.Data.EmergencyContact.PatientUserId).to.equal(
        getTestData('emergencyContactCreateModel').PatientUserId
    );
    expect(response.body.Data.EmergencyContact.ContactPersonId).to.equal(
        getTestData('emergencyContactCreateModel').ContactPersonId
    );
    expect(response.body.Data.EmergencyContact.ContactRelation).to.equal(
        getTestData('emergencyContactCreateModel').ContactRelation
    );
    expect(response.body.Data.EmergencyContact.AddressId).to.equal(getTestData('emergencyContactCreateModel').AddressId);
    expect(response.body.Data.EmergencyContact.IsAvailableForEmergency).to.equal(
        getTestData('emergencyContactCreateModel').IsAvailableForEmergency
    );
    expect(response.body.Data.EmergencyContact.TimeOfAvailability).to.equal(
        getTestData('emergencyContactCreateModel').TimeOfAvailability
    );
    expect(response.body.Data.EmergencyContact.Description).to.equal(getTestData('emergencyContactCreateModel').Description);
    expect(response.body.Data.EmergencyContact.AdditionalPhoneNumbers).to.equal(
        getTestData('emergencyContactCreateModel').AdditionalPhoneNumbers
    );
}

export const loadEmergencyContactCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        ContactPersonId: getTestData('patientPersonId'),
        ContactRelation: faker.lorem.word(),
        AddressId: getTestData('addressId'),
        IsAvailableForEmergency: faker.datatype.boolean(),
        TimeOfAvailability: '10:00 AM - 5:00 PM',
        Description: faker.word.words(5),
        AdditionalPhoneNumbers: faker.phone.number(),
    };
    setTestData(model, 'emergencyContactCreateModel');
};

export const loadEmergencyContactUpdateModel = async () => {
    const model = {
        IsAvailableForEmergency: faker.datatype.boolean(),
        TimeOfAvailability: '10:00 AM to 7:00 PM',
        Description: faker.word.words(5),
        AdditionalPhoneNumbers: faker.phone.number(),
    };
    setTestData(model, 'emergencyContactUpdateModel');
};

function loadEmergencyContactQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
