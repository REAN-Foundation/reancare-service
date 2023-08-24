import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient document tests', function() {

    var agent = request.agent(infra._app);

    it('54 - Negative - Get document type', function(done) {
        agent
            .get(`/api/v1/patient-documents/types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('55 - Negative - Create Patient document', function(done) {
        agent
            .post(`/api/v1/patient-documents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('56 - Negative - Get Patient document by id', function(done) {

        agent
            .get(`/api/v1/patient-documents/${getTestData('PatientDocument')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
   
    it('57 - Negative - Update Patient document', function(done) {
        loadPatientDocumentUpdateModel();
        const updateModel = getTestData("PatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocumentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('58 - Negative - Rename Patient document', function(done) {
        loadRenamePatientDocumentUpdateModel();
        const updateModel = getTestData("RenamePatientDocumentUpdateModel");
        agent
            .put(`/api/v1/patient-documents/${getTestData('PatientDocument')}/rename`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('59 - Negative - Search Patient document', function(done) {
        loadPatientDocumentQueryString();
        agent
            .get(`/api/v1/patient-documents/search${loadPatientDocumentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
