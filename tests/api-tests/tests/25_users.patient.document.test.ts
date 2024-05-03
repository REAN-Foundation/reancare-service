import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('25 - Patient document tests', function () {
    var agent = request.agent(infra._app);

    it('25:01 -> Get document type', function (done) {
        agent
            .get(`/api/v1/patient-documents/types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('25:02 -> Create Patient document', function (done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .field('PatientUserId', `${getTestData('patientUserId')}`)
            .field('MedicalPractitionerUserId', `${getTestData('doctorUserId')}`)
            .field('Name', 'image')
            .field('DocumentType', 'Lab Report')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect((response) => {
                setPatientDocumentId(response, 'patientDocumentId');
                expectPatientDocumentProperties(response);
            })
            .expect(201, done);
    });

    it('25:03 -> Get Patient document by id', function (done) {
        agent
            .get(`/api/v1/patient-documents/${getTestData('patientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectPatientDocumentProperties(response);
            })
            .expect(200, done);
    });

    it('25:04 -> Update Patient document', function (done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData('patientDocumentUpdateModel');
        agent
            .put(`/api/v1/patient-documents/${getTestData('patientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectPatientDocumentProperties(response);

                expect(response.body.Data.PatientDocument.MedicalPractitionerUserId).to.equal(
                    getTestData('patientDocumentUpdateModel').MedicalPractitionerUserId
                );
                expect(response.body.Data.PatientDocument.DocumentType).to.equal(
                    getTestData('patientDocumentUpdateModel').DocumentType
                );
                expect(response.body.Data.PatientDocument.MedicalPractionerRole).to.equal(
                    getTestData('patientDocumentUpdateModel').MedicalPractionerRole
                );
            })
            .expect(200, done);
    });

    it('25:05 -> Rename Patient document', function (done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData('renamePatientDocumentUpdateModel');
        agent
            .put(`/api/v1/patient-documents/${getTestData('patientDocumentId')}/rename`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('25:06 -> Search Patient document', function (done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('25:07 -> Negative - Get document type', function (done) {
        agent
            .get(`/api/v1/patient-documents/types/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25:08 -> Negative - Create Patient document', function (done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('25:09 -> Negative - Get Patient document by id', function (done) {
        agent
            .get(`/api/v1/patient-documents/${getTestData('patientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25:10 -> Negative - Update Patient document', function (done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData('patientDocumentUpdateModel');
        agent
            .put(`/api/v1/patient-documents/${getTestData('patientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25:11 -> Negative - Rename Patient document', function (done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData('renamePatientDocumentUpdateModel');
        agent
            .put(`/api/v1/patient-documents/${getTestData('patientDocumentId')}/rename`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25:12 -> Negative - Search Patient document', function (done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
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

function setPatientDocumentId(response, key) {
    setTestData(response.body.Data.PatientDocument.id, key);
}

function expectPatientDocumentProperties(response) {
    expect(response.body.Data.PatientDocument).to.have.property('id');
    expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
    expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
    expect(response.body.Data.PatientDocument).to.have.property('DocumentType');
}

export const loadPatientDocumentUpdateModel = async () => {
    const model = {
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        DocumentType: faker.lorem.words(3),
        MedicalPractionerRole: faker.lorem.word(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'patientDocumentUpdateModel');
};

export const loadRenamePatientDocumentUpdateModel = async () => {
    const model = {
        NewName: faker.system.commonFileName('jpg'),
    };
    setTestData(model, 'renamePatientDocumentUpdateModel');
};

function loadPatientDocumentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
