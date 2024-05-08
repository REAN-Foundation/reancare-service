import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('58 - Complaint tests', function () {
    var agent = request.agent(infra._app);

    it('58:01 -> Create complaint', function (done) {
        loadComplaintCreateModel();
        const createModel = getTestData('complaintCreateModel');
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setComplaintId(response, 'complaintId_1');
                expectComplaintProperties(response);

                expectComplaintPropertyValues(response);
            })
            .expect(201, done);
    });

    it('58:02 -> Get complaint by id', function (done) {
        agent
            .get(`/api/v1/clinical/complaints/${getTestData('complaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectComplaintProperties(response);

                expectComplaintPropertyValues(response);
            })
            .expect(200, done);
    });

    it('58:03 -> Search complaint records', function (done) {
        loadComplaintQueryString();
        agent
            .get(`/api/v1/clinical/complaints/search/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('58:04 -> Update complaint', function (done) {
        loadComplaintUpdateModel();
        const updateModel = getTestData('complaintUpdateModel');
        agent
            .put(`/api/v1/clinical/complaints/${getTestData('complaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectComplaintProperties(response);

                expect(response.body.Data.Complaint.PatientUserId).to.equal(
                    getTestData('complaintUpdateModel').PatientUserId
                );
                expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(
                    getTestData('complaintUpdateModel').MedicalPractitionerUserId
                );
                expect(response.body.Data.Complaint.VisitId).to.equal(getTestData('complaintUpdateModel').VisitId);
                expect(response.body.Data.Complaint.EhrId).to.equal(getTestData('complaintUpdateModel').EhrId);
                expect(response.body.Data.Complaint.Complaint).to.equal(getTestData('complaintUpdateModel').Complaint);
                expect(response.body.Data.Complaint.Severity).to.equal(getTestData('complaintUpdateModel').Severity);
            })
            .expect(200, done);
    });

    it('58:05 -> Delete complaint', function (done) {
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('complaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create complaint again', function (done) {
        loadComplaintCreateModel();
        const createModel = getTestData('complaintCreateModel');
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setComplaintId(response, 'complaintId');
                expectComplaintProperties(response);

                expectComplaintPropertyValues(response);
            })
            .expect(201, done);
    });

    it('58:06 -> Negative - Create complaint', function (done) {
        loadNegativeComplaintCreateModel();
        const createModel = getTestData('negativeComplaintCreateModel');
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('58:07 -> Negative - Search complaint records', function (done) {
        loadComplaintQueryString();
        agent
            .get(`/api/v1/clinical/complaints/search/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('58:08 -> Negative - Delete complaint', function (done) {
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('complaintId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setComplaintId(response, key) {
    setTestData(response.body.Data.Complaint.id, key);
}

function expectComplaintProperties(response) {
    expect(response.body.Data.Complaint).to.have.property('id');
    expect(response.body.Data.Complaint).to.have.property('PatientUserId');
    expect(response.body.Data.Complaint).to.have.property('MedicalPractitionerUserId');
    expect(response.body.Data.Complaint).to.have.property('VisitId');
    expect(response.body.Data.Complaint).to.have.property('EhrId');
    expect(response.body.Data.Complaint).to.have.property('Complaint');
    expect(response.body.Data.Complaint).to.have.property('Severity');
    expect(response.body.Data.Complaint).to.have.property('RecordDate');
}

function expectComplaintPropertyValues(response) {
    expect(response.body.Data.Complaint.PatientUserId).to.equal(getTestData('complaintCreateModel').PatientUserId);
    expect(response.body.Data.Complaint.MedicalPractitionerUserId).to.equal(
        getTestData('complaintCreateModel').MedicalPractitionerUserId
    );
    expect(response.body.Data.Complaint.VisitId).to.equal(getTestData('complaintCreateModel').VisitId);
    expect(response.body.Data.Complaint.EhrId).to.equal(getTestData('complaintCreateModel').EhrId);
    expect(response.body.Data.Complaint.Complaint).to.equal(getTestData('complaintCreateModel').Complaint);
    expect(response.body.Data.Complaint.Severity).to.equal(getTestData('complaintCreateModel').Severity);
}

export const loadComplaintCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        VisitId: faker.string.uuid(),
        EhrId: faker.string.uuid(),
        Complaint: faker.lorem.words(),
        Severity: getRandomEnumValue(Severity),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'complaintCreateModel');
};

export const loadComplaintUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        VisitId: faker.string.uuid(),
        EhrId: faker.string.uuid(),
        Complaint: faker.lorem.words(),
        Severity: getRandomEnumValue(Severity),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'complaintUpdateModel');
};

function loadComplaintQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeComplaintCreateModel = async () => {
    const model = {
        VisitId: faker.string.uuid(),
        EhrId: faker.string.uuid(),
        Complaint: faker.lorem.words(),
        Severity: getRandomEnumValue(Severity),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativeComplaintCreateModel');
};
