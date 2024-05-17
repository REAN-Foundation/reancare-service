import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, startDate } from '../utils';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../src/domain.types/miscellaneous/clinical.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('108 - tests', function () {
    var agent = request.agent(infra._app);

    it('108:01 -> Create diagnosis', function (done) {
        loadDiagnosisCreateModel();
        const createModel = getTestData('diagnosisCreateModel');
        agent
            .post(`/api/v1/clinical/diagnoses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('108:02 -> Create doctor note', function (done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData('doctorNoteCreateModel');
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('108:03 -> Create Tenant', function (done) {
        loadTenantCreateModel();
        const createModel = getTestData('tenantCreateModel');
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('108:04 -> Get Tenant settings types', function (done) {
        agent
            .get(`/api/v1/tenant-settings/types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('108:05 -> Create knowledge nugget test', function (done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData('knowledgeNuggetCreateModel');
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
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
});

///////////////////////////////////////////////////////////////////////////

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

export const loadTenantCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Description: faker.lorem.word(10),
        Code: faker.lorem.words(1),
        // Phone: faker.phone.number(),
        Phone: '+91-1100000011',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'tenantCreateModel');
};

export const loadKnowledgeNuggetCreateModel = async () => {
    const model = {
        TopicName: faker.lorem.word(),
        BriefInformation: faker.word.words(),
        DetailedInformation: faker.word.words(),
        AdditionalResources: [faker.word.words()],
        Tags: [faker.word.words()],
    };
    setTestData(model, 'knowledgeNuggetCreateModel');
};
