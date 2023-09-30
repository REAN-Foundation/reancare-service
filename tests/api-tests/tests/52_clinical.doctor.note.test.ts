import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { ClinicalValidationStatus } from '../../../src/domain.types/miscellaneous/clinical.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('52 - Doctor note tests', function() {

    var agent = request.agent(infra._app);

    it('52:01 -> Create doctor note', function(done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData("DoctorNoteCreateModel");
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.DoctorNote.id, 'DoctorNoteId_1');
                expect(response.body.Data.DoctorNote).to.have.property('id');
                expect(response.body.Data.DoctorNote).to.have.property('PatientUserId');
                expect(response.body.Data.DoctorNote).to.have.property('VisitId');
                expect(response.body.Data.DoctorNote).to.have.property('ValidationStatus');
                expect(response.body.Data.DoctorNote).to.have.property('Notes');
                expect(response.body.Data.DoctorNote).to.have.property('RecordDate');

                setTestData(response.body.Data.DoctorNote.id, 'DoctorNoteId_1');

                expect(response.body.Data.DoctorNote.PatientUserId).to.equal(getTestData("DoctorNoteCreateModel").PatientUserId);
                expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData("DoctorNoteCreateModel").VisitId);
                expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(getTestData("DoctorNoteCreateModel").ValidationStatus);
                expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData("DoctorNoteCreateModel").Notes);

            })
            .expect(201, done);
    });

    it('52:02 -> Get doctor note by id', function(done) {

        agent
            .get(`/api/v1/clinical/doctor-notes/${getTestData('DoctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.DoctorNote).to.have.property('id');
                expect(response.body.Data.DoctorNote).to.have.property('PatientUserId');
                expect(response.body.Data.DoctorNote).to.have.property('VisitId');
                expect(response.body.Data.DoctorNote).to.have.property('ValidationStatus');
                expect(response.body.Data.DoctorNote).to.have.property('Notes');
                expect(response.body.Data.DoctorNote).to.have.property('RecordDate');

                expect(response.body.Data.DoctorNote.PatientUserId).to.equal(getTestData("DoctorNoteCreateModel").PatientUserId);
                expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData("DoctorNoteCreateModel").VisitId);
                expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(getTestData("DoctorNoteCreateModel").ValidationStatus);
                expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData("DoctorNoteCreateModel").Notes);

            })
            .expect(200, done);
    });

    it('52:03 -> Search doctor note records', function(done) {
        loadDoctorNoteQueryString();
        agent
            .get(`/api/v1/clinical/doctor-notes/search/${getTestData("PatientUserId")}${loadDoctorNoteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('52:04 -> Update doctor note', function(done) {
        loadDoctorNoteUpdateModel();
        const updateModel = getTestData("DoctorNoteUpdateModel");
        agent
            .put(`/api/v1/clinical/doctor-notes/${getTestData('DoctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.DoctorNote).to.have.property('id');
                expect(response.body.Data.DoctorNote).to.have.property('PatientUserId');
                expect(response.body.Data.DoctorNote).to.have.property('VisitId');
                expect(response.body.Data.DoctorNote).to.have.property('ValidationStatus');
                expect(response.body.Data.DoctorNote).to.have.property('Notes');
                expect(response.body.Data.DoctorNote).to.have.property('RecordDate');

                expect(response.body.Data.DoctorNote.PatientUserId).to.equal(getTestData("DoctorNoteUpdateModel").PatientUserId);
                expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData("DoctorNoteUpdateModel").VisitId);
                expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(getTestData("DoctorNoteUpdateModel").ValidationStatus);
                expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData("DoctorNoteUpdateModel").Notes);
            })
            .expect(200, done);
    });

    it('52:05 -> Delete doctor note', function(done) {
        
        agent
            .delete(`/api/v1/clinical/doctor-notes/${getTestData('DoctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create doctor note again', function(done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData("DoctorNoteCreateModel");
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.DoctorNote.id, 'DoctorNoteId');
                expect(response.body.Data.DoctorNote).to.have.property('id');
                expect(response.body.Data.DoctorNote).to.have.property('PatientUserId');
                expect(response.body.Data.DoctorNote).to.have.property('VisitId');
                expect(response.body.Data.DoctorNote).to.have.property('ValidationStatus');
                expect(response.body.Data.DoctorNote).to.have.property('Notes');
                expect(response.body.Data.DoctorNote).to.have.property('RecordDate');

                setTestData(response.body.Data.DoctorNote.id, 'DoctorNoteId');

                expect(response.body.Data.DoctorNote.PatientUserId).to.equal(getTestData("DoctorNoteCreateModel").PatientUserId);
                expect(response.body.Data.DoctorNote.VisitId).to.equal(getTestData("DoctorNoteCreateModel").VisitId);
                expect(response.body.Data.DoctorNote.ValidationStatus).to.equal(getTestData("DoctorNoteCreateModel").ValidationStatus);
                expect(response.body.Data.DoctorNote.Notes).to.equal(getTestData("DoctorNoteCreateModel").Notes);

            })
            .expect(201, done);
    });

    it('52:06 -> Negative - Create doctor note', function(done) {
        loadNegativeDoctorNoteCreateModel();
        const createModel = getTestData("NegativeDoctorNoteCreateModel");
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('52:07 -> Negative - Search doctor note records', function(done) {
        loadDoctorNoteQueryString();
        agent
            .get(`/api/v1/clinical/doctor-notes/search/${getTestData("PatientUserId")}${loadDoctorNoteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('52:08 -> Negative - Delete doctor note', function(done) {
        
        agent
            .delete(`/api/v1/clinical/doctor-notes/${getTestData('DoctorNoteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadDoctorNoteCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        VisitId          : getTestData("DoctorId"),
        ValidationStatus : getRandomEnumValue(ClinicalValidationStatus),
        Notes            : faker.lorem.words(),
        RecordDate       : faker.date.anytime()
  
    };
    setTestData(model, "DoctorNoteCreateModel");
};

export const loadDoctorNoteUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        VisitId          : getTestData("DoctorId"),
        ValidationStatus : getRandomEnumValue(ClinicalValidationStatus),
        Notes            : faker.lorem.words(),
        RecordDate       : faker.date.anytime()
    };
    setTestData(model, "DoctorNoteUpdateModel");
};

function loadDoctorNoteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeDoctorNoteCreateModel = async (
) => {
    const model = {
        VisitId    : getTestData("DoctorId"),
        RecordDate : faker.date.anytime()
      
    };
    setTestData(model, "NegativeDoctorNoteCreateModel");
};


