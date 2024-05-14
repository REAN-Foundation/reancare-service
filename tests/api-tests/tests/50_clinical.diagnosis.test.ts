import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../src/domain.types/miscellaneous/clinical.types';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('50 - Diagnosis tests', function () {
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

    it('50:02 -> Create diagnosis', function (done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData('diagnosisCreateModel');
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDiagnosisId(response, 'diagnosisId_1');
                expectDiagnosisProperties(response);

                expectDiagnosisPropertyValues(response);
            })
            .expect(201, done);
    });

    it('50:03 -> Get diagnosis by id', function (done) {
        agent
            .get(`/api/v1/clinical/diagnoses/${getTestData('diagnosisId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectDiagnosisProperties(response);

                expectDiagnosisPropertyValues(response);
            })
            .expect(200, done);
    });

    it('50:04 -> Search diagnosis records', function (done) {
        loadDiagnosisQueryString();
        agent
            .get(`/api/v1/clinical/diagnoses/search${loadDiagnosisQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Diagnosis).to.have.property('TotalCount');
                expect(response.body.Data.Diagnosis).to.have.property('RetrievedCount');
                expect(response.body.Data.Diagnosis).to.have.property('PageIndex');
                expect(response.body.Data.Diagnosis).to.have.property('ItemsPerPage');
                expect(response.body.Data.Diagnosis).to.have.property('Order');
                expect(response.body.Data.Diagnosis.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Diagnosis.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Diagnosis.Items.length).to.greaterThan(0);
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

    it('50:06 -> Update diagnosis', function (done) {
        loadDiagnosisUpdateModel();
        const updateModel = getTestData('diagnosisUpdateModel');
        agent
            .put(`/api/v1/clinical/diagnoses/${getTestData('diagnosisId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectDiagnosisProperties(response);

                expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(
                    getTestData('diagnosisUpdateModel').MedicalPractitionerUserId
                );
                expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData('diagnosisUpdateModel').Comments);
                expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(
                    getTestData('diagnosisUpdateModel').IsClinicallyActive
                );
                expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(
                    getTestData('diagnosisUpdateModel').ValidationStatus
                );
                expect(response.body.Data.Diagnosis.Interpretation).to.equal(
                    getTestData('diagnosisUpdateModel').Interpretation
                );
            })
            .expect(200, done);
    });

    it('50:07 -> Delete diagnosis', function (done) {
        agent
            .delete(`/api/v1/clinical/diagnoses/${getTestData('diagnosisId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create diagnosis again', function (done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData('diagnosisCreateModel');
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDiagnosisId(response, 'diagnosisId');
                expectDiagnosisProperties(response);

                expectDiagnosisPropertyValues(response);
            })
            .expect(201, done);
    });

    it('50:08 -> Negative - Create diagnosis', function (done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData('diagnosisCreateModel');
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('50:09 -> Negative - Search diagnosis records', function (done) {
        loadDiagnosisQueryString();
        agent
            .get(`/api/v1/clinical/diagnoses/search${loadDiagnosisQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('50:10 -> Negative - Delete diagnosis', function (done) {
        agent
            .delete(`/api/v1/clinical/diagnoses/${getTestData('diagnosisId_1')}`)
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

function setDiagnosisId(response, key) {
    setTestData(response.body.Data.Diagnosis.id, key);
}

function expectDiagnosisProperties(response) {
    expect(response.body.Data.Diagnosis).to.have.property('id');
    expect(response.body.Data.Diagnosis).to.have.property('MedicalPractitionerUserId');
    expect(response.body.Data.Diagnosis).to.have.property('MedicalConditionId');
    expect(response.body.Data.Diagnosis).to.have.property('Comments');
    expect(response.body.Data.Diagnosis).to.have.property('IsClinicallyActive');
    expect(response.body.Data.Diagnosis).to.have.property('ValidationStatus');
    expect(response.body.Data.Diagnosis).to.have.property('Interpretation');
    expect(response.body.Data.Diagnosis).to.have.property('OnsetDate');
    expect(response.body.Data.Diagnosis).to.have.property('EndDate');
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

function expectDiagnosisPropertyValues(response) {
    expect(response.body.Data.Diagnosis.MedicalPractitionerUserId).to.equal(
        getTestData('diagnosisCreateModel').MedicalPractitionerUserId
    );
    expect(response.body.Data.Diagnosis.MedicalConditionId).to.equal(getTestData('diagnosisCreateModel').MedicalConditionId);
    expect(response.body.Data.Diagnosis.Comments).to.equal(getTestData('diagnosisCreateModel').Comments);
    expect(response.body.Data.Diagnosis.IsClinicallyActive).to.equal(getTestData('diagnosisCreateModel').IsClinicallyActive);
    expect(response.body.Data.Diagnosis.ValidationStatus).to.equal(getTestData('diagnosisCreateModel').ValidationStatus);
    expect(response.body.Data.Diagnosis.Interpretation).to.equal(getTestData('diagnosisCreateModel').Interpretation);
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
        ResourceName: 'Clinical.Diagnosis.Create',
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

export const loadDiagnosisCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        MedicalConditionId: null,
        Comments: faker.lorem.words(),
        IsClinicallyActive: faker.datatype.boolean(),
        ValidationStatus: getRandomEnumValue(ClinicalValidationStatus),
        Interpretation: getRandomEnumValue(ClinicalInterpretation),
        OnsetDate: startDate,
        EndDate: endDate,
    };
    setTestData(model, 'diagnosisCreateModel');
};

export const loadUpdateConsentCreateModel = async () => {
    const model = {
        ResourceId: getTestData('doctorUserId'),
        TenantId: getTestData('tenantId'),
        ResourceCategory: faker.lorem.word(),
        ResourceName: 'Clinical.Diagnosis.Update',
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

export const loadDiagnosisUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        Comments: faker.lorem.words(),
        IsClinicallyActive: faker.datatype.boolean(),
        ValidationStatus: getRandomEnumValue(ClinicalValidationStatus),
        Interpretation: getRandomEnumValue(ClinicalInterpretation),
        OnsetDate: startDate,
        EndDate: endDate,
    };
    setTestData(model, 'diagnosisUpdateModel');
};

function loadDiagnosisQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
