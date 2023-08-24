import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Complaint tests', function() {

    var agent = request.agent(infra._app);

    it('173 - Negative - Create complaint', function(done) {
        loadComplaintCreateModel();
        const createModel = getTestData("ComplaintCreateModel");
        agent
            .post(`/api/v1/clinical/complaints/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('174 - Negative - Search complaint records', function(done) {
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

    it('175 - Negative - Delete complaint', function(done) {
        
        agent
            .delete(`/api/v1/clinical/complaints/${getTestData('Complaint')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
