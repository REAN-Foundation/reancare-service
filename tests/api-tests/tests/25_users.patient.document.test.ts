import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('25 - Patient document tests', function() {

    var agent = request.agent(infra._app);

    it('25:01 -> Get document type', function(done) {
        agent
            .get(`/api/v1/patient-documents/types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('25:02 -> Create Patient document', function(done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('PatientUserId', `${getTestData("PatientUserId")}`)
            .field('MedicalPractitionerUserId', `${getTestData("DoctorUserId")}`)
            .field('Name', 'image')
            .field('DocumentType', 'Lab Report')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect(response => {
                setTestData(response.body.Data.PatientDocument.id, 'PatientDocumentId');
                expect(response.body.Data.PatientDocument).to.have.property('id');
                expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.PatientDocument).to.have.property('DocumentType');

            })
            .expect(201, done);
    });

    it('25:03 -> Get Patient document by id', function(done) {

        agent
            .get(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.PatientDocument).to.have.property('id');
                expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.PatientDocument).to.have.property('DocumentType');
            })
            .expect(200, done);
    });
   
    it('25:04 -> Update Patient document', function(done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData("PatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.PatientDocument).to.have.property('id');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.PatientDocument).to.have.property('DocumentType');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractionerRole');
                expect(response.body.Data.PatientDocument).to.have.property('RecordDate');

                expect(response.body.Data.PatientDocument.MedicalPractitionerUserId).to.equal(getTestData("PatientDocumentUpdateModel").MedicalPractitionerUserId);
                expect(response.body.Data.PatientDocument.DocumentType).to.equal(getTestData("PatientDocumentUpdateModel").DocumentType);
                expect(response.body.Data.PatientDocument.MedicalPractionerRole).to.equal(getTestData("PatientDocumentUpdateModel").MedicalPractionerRole);

            })
            .expect(200, done);
    });

    it('25:05 -> Rename Patient document', function(done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData("RenamePatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}/rename`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('25:06 -> Search Patient document', function(done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('25:07 -> Negative - Get document type', function(done) {
        agent
            .get(`/api/v1/patient-documents/types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25:08 -> Negative - Create Patient document', function(done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('25:09 -> Negative - Get Patient document by id', function(done) {

        agent
            .get(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
   
    it('25:10 -> Negative - Update Patient document', function(done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData("PatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('25:11 -> Negative - Rename Patient document', function(done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData("RenamePatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}/rename`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('25:12 -> Negative - Search Patient document', function(done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientDocumentUpdateModel = async (
) => {
    const model = {
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        DocumentType              : faker.lorem.words(3),
        MedicalPractionerRole     : faker.lorem.word(),
        RecordDate                : faker.date.anytime()
    
    };
    setTestData(model, "PatientDocumentUpdateModel");
};

export const loadRenamePatientDocumentUpdateModel = async (
) => {
    const model = {
        NewName : faker.system.commonFileName('jpg')
        
    };
    setTestData(model, "RenamePatientDocumentUpdateModel");
};

function loadPatientDocumentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
