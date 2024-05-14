import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { ClinicalValidationStatus } from '../../../src/domain.types/miscellaneous/clinical.types';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('52 - Doctor note tests', function () {
    var agent = request.agent(infra._app);

    it('50:01 -> Create consent', function (done) {
        loadConsentCreateModel();
        const createModel = getTestData('consentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setConsentId(response, 'consentId');
                expectConsentProperties(response);

                expectConsentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('52:01 -> Create doctor note', function (done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData('doctorNoteCreateModel');
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDoctorNoteId(response, 'doctorNoteId_1');
                expectDoctorNoteProperties(response);

                expectDoctorNotePropertyValues(response);
            })
            .expect(201, done);
    });

    it('52:02 -> Get doctor note by id', function (done) {
        agent
            .get(`/api/v1/clinical/doctor-notes/${getTestData('doctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectDoctorNoteProperties(response);

                expectDoctorNotePropertyValues(response);
            })
            .expect(200, done);
    });

    it('52:03 -> Search doctor note records', function (done) {
        loadDoctorNoteQueryString();
        agent
            .get(`/api/v1/clinical/doctor-notes/search/${getTestData('patientUserId')}${loadDoctorNoteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.DoctorNotes).to.have.property('TotalCount');
                expect(response.body.Data.DoctorNotes).to.have.property('RetrievedCount');
                expect(response.body.Data.DoctorNotes).to.have.property('PageIndex');
                expect(response.body.Data.DoctorNotes).to.have.property('ItemsPerPage');
                expect(response.body.Data.DoctorNotes).to.have.property('Order');
                expect(response.body.Data.DoctorNotes.TotalCount).to.greaterThan(0);
                expect(response.body.Data.DoctorNotes.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.DoctorNotes.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('50:05 -> Create consent', function (done) {
        loadUpdateConsentCreateModel();
        const createModel = getTestData('consentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setConsentId(response, 'consentId');
                expectConsentProperties(response);

                expectConsentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('52:04 -> Update doctor note', function (done) {
        loadDoctorNoteUpdateModel();
        const updateModel = getTestData('doctorNoteUpdateModel');
        agent
            .put(`/api/v1/clinical/doctor-notes/${getTestData('doctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectDoctorNoteProperties(response);

                expect(response.body.Data.DoctorNote.PatientUserId).to.equal(
                    getTestData('doctorNoteUpdateModel').PatientUserId
                );
                expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData('doctorNoteUpdateModel').VisitId);
                expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(
                    getTestData('doctorNoteUpdateModel').ValidationStatus
                );
                expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData('doctorNoteUpdateModel').Notes);
            })
            .expect(200, done);
    });

    it('52:05 -> Delete doctor note', function (done) {
        agent
            .delete(`/api/v1/clinical/doctor-notes/${getTestData('doctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create doctor note again', function (done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData('doctorNoteCreateModel');
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDoctorNoteId(response, 'doctorNoteId');
                expectDoctorNoteProperties(response);

                expectDoctorNotePropertyValues(response);
            })
            .expect(201, done);
    });

    it('52:06 -> Negative - Create doctor note', function (done) {
        loadNegativeDoctorNoteCreateModel();
        const createModel = getTestData('negativeDoctorNoteCreateModel');
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('52:07 -> Negative - Search doctor note records', function (done) {
        loadDoctorNoteQueryString();
        agent
            .get(`/api/v1/clinical/doctor-notes/search/${getTestData('patientUserId')}${loadDoctorNoteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('52:08 -> Negative - Delete doctor note', function (done) {
        agent
            .delete(`/api/v1/clinical/doctor-notes/${getTestData('doctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setDoctorNoteId(response, key) {
    setTestData(response.body.Data.DoctorNote.id, key);
}

function expectDoctorNoteProperties(response) {
    expect(response.body.Data.DoctorNote).to.have.property('id');
    expect(response.body.Data.DoctorNote).to.have.property('PatientUserId');
    expect(response.body.Data.DoctorNote).to.have.property('VisitId');
    expect(response.body.Data.DoctorNote).to.have.property('ValidationStatus');
    expect(response.body.Data.DoctorNote).to.have.property('Notes');
    expect(response.body.Data.DoctorNote).to.have.property('RecordDate');
}

function setConsentId(response, key) {
    setTestData(response.body.Data.Consent.id, key);
}

function expectConsentProperties(response) {
    expect(response.body.Data.Consent).to.have.property('ResourceId');
    expect(response.body.Data.Consent).to.have.property('TenantId');
    expect(response.body.Data.Consent).to.have.property('ResourceCategory');
    expect(response.body.Data.Consent).to.have.property('ResourceName');
    expect(response.body.Data.Consent).to.have.property('ConsentHolderUserId');
    expect(response.body.Data.Consent).to.have.property('AllResourcesInCategory');
    expect(response.body.Data.Consent).to.have.property('TenantOwnedResource');
    expect(response.body.Data.Consent).to.have.property('Perpetual');
    expect(response.body.Data.Consent).to.have.property('RevokedTimestamp');
    expect(response.body.Data.Consent).to.have.property('ConsentGivenOn');
    expect(response.body.Data.Consent).to.have.property('ConsentValidFrom');
    expect(response.body.Data.Consent).to.have.property('ConsentValidTill');
}

function expectDoctorNotePropertyValues(response) {
    expect(response.body.Data.DoctorNote.PatientUserId).to.equal(getTestData('doctorNoteCreateModel').PatientUserId);
    expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData('doctorNoteCreateModel').VisitId);
    expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(getTestData('doctorNoteCreateModel').ValidationStatus);
    expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData('doctorNoteCreateModel').Notes);
}

function expectConsentPropertyValues(response) {
    expect(response.body.Data.Consent.ResourceId).to.equal(getTestData('consentCreateModel').ResourceId);
    expect(response.body.Data.Consent.TenantId).to.equal(getTestData('consentCreateModel').TenantId);
    expect(response.body.Data.Consent.ResourceCategory).to.equal(getTestData('consentCreateModel').ResourceCategory);
    expect(response.body.Data.Consent.ResourceName).to.equal(getTestData('consentCreateModel').ResourceName);
    expect(response.body.Data.Consent.ConsentHolderUserId).to.equal(getTestData('consentCreateModel').ConsentHolderUserId);
    expect(response.body.Data.Consent.AllResourcesInCategory).to.equal(
        getTestData('consentCreateModel').AllResourcesInCategory
    );
    expect(response.body.Data.Consent.TenantOwnedResource).to.equal(getTestData('consentCreateModel').TenantOwnedResource);
    expect(response.body.Data.Consent.Perpetual).to.equal(getTestData('consentCreateModel').Perpetual);
}

export const loadConsentCreateModel = async () => {
    const model = {
        ResourceId: getTestData('patientUserId'),
        TenantId: getTestData('tenantId'),
        ResourceCategory: faker.lorem.word(),
        ResourceName: 'Clinical.DoctorNote.Create',
        ConsentHolderUserId: getTestData('doctorUserId'),
        AllResourcesInCategory: faker.datatype.boolean(),
        TenantOwnedResource: faker.datatype.boolean(),
        Perpetual: true,
        Revoked: false,
        RevokedTimestamp: startDate,
        ConsentGivenOn: faker.date.anytime(),
        ConsentValidFrom: startDate,
        ConsentValidTill: endDate,
    };
    setTestData(model, 'consentCreateModel');
};

export const loadDoctorNoteCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        VisitId: getTestData('doctorId'),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        ValidationStatus: getRandomEnumValue(ClinicalValidationStatus),
        Notes: faker.lorem.words(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'doctorNoteCreateModel');
};

export const loadUpdateConsentCreateModel = async () => {
    const model = {
        ResourceId: getTestData('doctorUserId'),
        TenantId: getTestData('tenantId'),
        ResourceCategory: faker.lorem.word(),
        ResourceName: 'Clinical.DoctorNote.Update',
        ConsentHolderUserId: getTestData('doctorUserId'),
        AllResourcesInCategory: faker.datatype.boolean(),
        TenantOwnedResource: faker.datatype.boolean(),
        Perpetual: true,
        Revoked: false,
        RevokedTimestamp: startDate,
        ConsentGivenOn: faker.date.anytime(),
        ConsentValidFrom: startDate,
        ConsentValidTill: endDate,
    };
    setTestData(model, 'consentCreateModel');
};

export const loadDoctorNoteUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        VisitId: getTestData('doctorId'),
        ValidationStatus: getRandomEnumValue(ClinicalValidationStatus),
        Notes: faker.lorem.words(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'doctorNoteUpdateModel');
};

function loadDoctorNoteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeDoctorNoteCreateModel = async () => {
    const model = {
        VisitId: getTestData('doctorId'),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativeDoctorNoteCreateModel');
};
