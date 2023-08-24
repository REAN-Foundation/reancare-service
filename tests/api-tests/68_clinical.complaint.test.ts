import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Complaint tests', function() {

    var agent = request.agent(infra._app);

    it('312 - Create complaint', function(done) {
        loadComplaintCreateModel();
        const createModel = getTestData("ComplaintCreateModel");
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Complaint.id, 'ComplaintId');
                expect(response.body.Data.Complaint).to.have.property('id');
                expect(response.body.Data.Complaint).to.have.property('PatientUserId');
                expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Complaint).to.have.property('VisitId');
                expect(response.body.Data.Complaint).to.have.property('EhrId');
                expect(response.body.Data.Complaint).to.have.property('Complaint');
                expect(response.body.Data.Complaint).to.have.property('Severity');
                expect(response.body.Data.Complaint).to.have.property('RecordDate');

                setTestData(response.body.Data.Complaint.id, 'ComplaintId');

                expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData("ComplaintCreateModel").PatientUserId);
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(getTestData("ComplaintCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData("ComplaintCreateModel").VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData("ComplaintCreateModel").EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData("ComplaintCreateModel").Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData("ComplaintCreateModel").Severity);
                expect(response.body.Data.Complaint.RecordDate).to.equal(getTestData("ComplaintCreateModel").RecordDate);

            })
            .expect(201, done);
    });

    it('313 - Get complaint by id', function(done) {

        agent
            .get(`/api/v1/clinical/complaints/${getTestData('ComplaintId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Complaint).to.have.property('id');
                expect(response.body.Data.Complaint).to.have.property('PatientUserId');
                expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Complaint).to.have.property('VisitId');
                expect(response.body.Data.Complaint).to.have.property('EhrId');
                expect(response.body.Data.Complaint).to.have.property('Complaint');
                expect(response.body.Data.Complaint).to.have.property('Severity');
                expect(response.body.Data.Complaint).to.have.property('RecordDate');

                expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData("ComplaintCreateModel").PatientUserId);
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(getTestData("ComplaintCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData("ComplaintCreateModel").VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData("ComplaintCreateModel").EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData("ComplaintCreateModel").Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData("ComplaintCreateModel").Severity);
                expect(response.body.Data.Complaint.RecordDate).to.equal(getTestData("ComplaintCreateModel").RecordDate);

            })
            .expect(200, done);
    });

    it('314 - Search complaint records', function(done) {
        loadComplaintQueryString();
        agent
            .get(`/api/v1/clinical/complaints/search/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('315 - Update complaint', function(done) {
        loadComplaintUpdateModel();
        const updateModel = getTestData("ComplaintUpdateModel");
        agent
            .put(`/api/v1/clinical/complaints/${getTestData('ComplaintId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Complaint).to.have.property('id');
                expect(response.body.Data.Complaint).to.have.property('PatientUserId');
                expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Complaint).to.have.property('VisitId');
                expect(response.body.Data.Complaint).to.have.property('EhrId');
                expect(response.body.Data.Complaint).to.have.property('Complaint');
                expect(response.body.Data.Complaint).to.have.property('Severity');
                expect(response.body.Data.Complaint).to.have.property('RecordDate');

                expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData("ComplaintUpdateModel").PatientUserId);
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(getTestData("ComplaintUpdateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData("ComplaintUpdateModel").VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData("ComplaintUpdateModel").EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData("ComplaintUpdateModel").Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData("ComplaintUpdateModel").Severity);
                expect(response.body.Data.Complaint.RecordDate).to.equal(getTestData("ComplaintUpdateModel").RecordDate);
            })
            .expect(200, done);
    });

    it('316 - Delete complaint', function(done) {
        
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('ComplaintId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
    
    it('Create complaint again', function(done) {
        loadComplaintCreateModel();
        const createModel = getTestData("ComplaintCreateModel");
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Complaint.id, 'ComplaintId');
                expect(response.body.Data.Complaint).to.have.property('id');
                expect(response.body.Data.Complaint).to.have.property('PatientUserId');
                expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Complaint).to.have.property('VisitId');
                expect(response.body.Data.Complaint).to.have.property('EhrId');
                expect(response.body.Data.Complaint).to.have.property('Complaint');
                expect(response.body.Data.Complaint).to.have.property('Severity');
                expect(response.body.Data.Complaint).to.have.property('RecordDate');

                setTestData(response.body.Data.Complaint.id, 'ComplaintId');

                expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData("ComplaintCreateModel").PatientUserId);
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(getTestData("ComplaintCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData("ComplaintCreateModel").VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData("ComplaintCreateModel").EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData("ComplaintCreateModel").Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData("ComplaintCreateModel").Severity);
                expect(response.body.Data.Complaint.RecordDate).to.equal(getTestData("ComplaintCreateModel").RecordDate);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadComplaintCreateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        VisitId                   : "716ac880-3dd6-4200-bf34-678dbdc5fb1b",
        EhrId                     : "556ac880-3dd6-4200-bf34-678dbdc5fb1b",
        Complaint                 : "Patient complaint",
        Severity                  : "High",
        RecordDate                : "2023-09-23T00:00:00.000Z"
  
    };
    setTestData(model, "ComplaintCreateModel");
};

export const loadComplaintUpdateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        VisitId                   : "716ac880-3dd6-4200-bf34-678dbdc5fb1b",
        EhrId                     : "556ac880-3dd6-4200-bf34-678dbdc5fb1b",
        Complaint                 : "Patient",
        Severity                  : "Low",
        RecordDate                : "2023-10-23T00:00:00.000Z"
    };
    setTestData(model, "ComplaintUpdateModel");
};

function loadComplaintQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?orderDateFrom=2021-09-23';
    return queryString;
}
