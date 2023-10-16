import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('58 - Complaint tests', function() {

    var agent = request.agent(infra._app);

    it('58:01 -> Create complaint', function(done) {
        loadComplaintCreateModel();
        const createModel = getTestData("ComplaintCreateModel");
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Complaint.id, 'ComplaintId_1');
                expect(response.body.Data.Complaint).to.have.property('id');
                expect(response.body.Data.Complaint).to.have.property('PatientUserId');
                expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
                expect(response.body.Data.Complaint).to.have.property('VisitId');
                expect(response.body.Data.Complaint).to.have.property('EhrId');
                expect(response.body.Data.Complaint).to.have.property('Complaint');
                expect(response.body.Data.Complaint).to.have.property('Severity');
                expect(response.body.Data.Complaint).to.have.property('RecordDate');

                setTestData(response.body.Data.Complaint.id, 'ComplaintId_1');

                expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData("ComplaintCreateModel").PatientUserId);
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(getTestData("ComplaintCreateModel").MedicalPractitionerUserId);
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData("ComplaintCreateModel").VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData("ComplaintCreateModel").EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData("ComplaintCreateModel").Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData("ComplaintCreateModel").Severity);

            })
            .expect(201, done);
    });

    it('58:02 -> Get complaint by id', function(done) {

        agent
            .get(`/api/v1/clinical/complaints/${getTestData('ComplaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

            })
            .expect(200, done);
    });

    it('58:03 -> Search complaint records', function(done) {
        loadComplaintQueryString();
        agent
            .get(`/api/v1/clinical/complaints/search/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('58:04 -> Update complaint', function(done) {
        loadComplaintUpdateModel();
        const updateModel = getTestData("ComplaintUpdateModel");
        agent
            .put(`/api/v1/clinical/complaints/${getTestData('ComplaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            })
            .expect(200, done);
    });

    it('58:05 -> Delete complaint', function(done) {
        
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('ComplaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

            })
            .expect(201, done);
    });

    it('58:06 -> Negative - Create complaint', function(done) {
        loadNegativeComplaintCreateModel();
        const createModel = getTestData("NegativeComplaintCreateModel");
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('58:07 -> Negative - Search complaint records', function(done) {
        loadComplaintQueryString();
        agent
            .get(`/api/v1/clinical/complaints/search/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('58:08 -> Negative - Delete complaint', function(done) {
        
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('ComplaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadComplaintCreateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        VisitId                   : faker.string.uuid(),
        EhrId                     : faker.string.uuid(),
        Complaint                 : faker.lorem.words(),
        Severity                  : getRandomEnumValue(Severity),
        RecordDate                : faker.date.anytime()
  
    };
    setTestData(model, "ComplaintCreateModel");
};

export const loadComplaintUpdateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        VisitId                   : faker.string.uuid(),
        EhrId                     : faker.string.uuid(),
        Complaint                 : faker.lorem.words(),
        Severity                  : getRandomEnumValue(Severity),
        RecordDate                : faker.date.anytime()
    };
    setTestData(model, "ComplaintUpdateModel");
};

function loadComplaintQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeComplaintCreateModel = async (
) => {
    const model = {
        VisitId    : faker.string.uuid(),
        EhrId      : faker.string.uuid(),
        Complaint  : faker.lorem.words(),
        Severity   : getRandomEnumValue(Severity),
        RecordDate : faker.date.anytime()
  
    };
    setTestData(model, "NegativeComplaintCreateModel");
};

