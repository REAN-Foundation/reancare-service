import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient document tests', function() {

    var agent = request.agent(infra._app);

    it('104 - Get document type', function(done) {
        agent
            .get(`/api/v1/patient-documents/types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('105 - Create Patient document', function(done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('PatientUserId', `${getTestData("PatientUserId")}`)
            .field('MedicalPractitionerUserId', `${getTestData("DoctorUserId")}`)
            .field('Name', 'image')
            .field('DocumentType', 'Lab Report')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.PatientDocument.id, 'PatientDocumentId');
                expect(response.body.Data.PatientDocument).to.have.property('id');
                expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.PatientDocument).to.have.property('DocumentType');

            })
            .expect(201, done);
    });

    it('106 - Get Patient document by id', function(done) {

        agent
            .get(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.PatientDocument).to.have.property('id');
                expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
                expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.PatientDocument).to.have.property('DocumentType');
            })
            .expect(200, done);
    });

    // it('107 - Download Patient document', function(done) {
    //     const id = `${getTestData('PatientDocumentId')}`;
    //     agent
    //         .get(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}/download`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body.Data.PatientDocument).to.have.property('id');
    //             expect(response.body.Data.PatientDocument).to.have.property('PatientUserId');
    //             expect(response.body.Data.PatientDocument).to.have.property('MedicalPractitionerUserId');
    //             expect(response.body.Data.PatientDocument).to.have.property('DocumentType');
    //         })
    //         .expect(200, done);
    // });
   
    it('108 - Update Patient document', function(done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData("PatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.PatientDocument.RecordDate).to.equal(getTestData("PatientDocumentUpdateModel").RecordDate);

            })
            .expect(200, done);
    });

    it('109 - Rename Patient document', function(done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData("RenamePatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}/rename`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    // it('110 - Get shareable link for document', function(done) {
    //     loadShareLinkQueryString();
    //     agent
    //         .get(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}/share${loadShareLinkQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body.Data.GoalRecords).to.have.property('TotalCount');
    //             expect(response.body.Data.GoalRecords).to.have.property('RetrievedCount');
    //             expect(response.body.Data.GoalRecords).to.have.property('PageIndex');
    //             expect(response.body.Data.GoalRecords).to.have.property('ItemsPerPage');
    //             expect(response.body.Data.GoalRecords).to.have.property('Order');
    //             expect(response.body.Data.GoalRecords.TotalCount).to.greaterThan(0);
    //             expect(response.body.Data.GoalRecords.RetrievedCount).to.greaterThan(0);
    //             expect(response.body.Data.GoalRecords.Items.length).to.greaterThan(0);
    //         })
    //         .expect(200, done);
    // });

    it('111 - Search Patient document', function(done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('112 - Delete Patient document', function(done) {
    //     const id = `${getTestData('PatientDocumentId')}`;
        
    //     //Delete
    //     agent
    //         .delete(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientDocumentUpdateModel = async (
) => {
    const model = {
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        DocumentType              : "Drug prescription",
        MedicalPractionerRole     : "Doctor",
        RecordDate                : "2021-09-24T00:00:00.000Z"
    
    };
    setTestData(model, "PatientDocumentUpdateModel");
};

export const loadRenamePatientDocumentUpdateModel = async (
) => {
    const model = {
        NewName : "coughh.png"
        
    };
    setTestData(model, "RenamePatientDocumentUpdateModel");
};

// function loadShareLinkQueryString() {
//     //This is raw query. Please modify to suit the test
//     const queryString = '?documentType=Drug prescription';
//     return queryString;
// }

function loadPatientDocumentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?documentType=Drug prescription';
    return queryString;
}
