import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Doctor note tests', function() {

    var agent = request.agent(infra._app);

    it('153 - Negative - Create doctor note', function(done) {
        loadDoctorNoteCreateModel();
        const createModel = getTestData("DoctorNoteCreateModel");
        agent
            .post(`/api/v1/clinical/doctor-notes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('154 - Negative - Search doctor note records', function(done) {
        loadDoctorNoteQueryString();
        agent
            .get(`/api/v1/clinical/doctor-notes/search/${getTestData("PatientUser")}${loadDoctorNoteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('155 - Negative - Delete doctor note', function(done) {
        
        agent
            .delete(`/api/v1/clinical/doctor-notes/${getTestData('DoctorNote')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
  
    };
    setTestData(model, "DoctorNoteCreateModel");
};

export const loadDoctorNoteUpdateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        VisitId          : getTestData("DoctorId"),
        ValidationStatus : "Preliminary",
        Notes            : "Prescribing rest at home and light food",
        RecordDate       : "2023-10-16T00:00:00.000Z"
    };
    setTestData(model, "DoctorNoteUpdateModel");
};

function loadDoctorNoteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?notes=Prescribing two days bed rest and more liquid no fried food';
    return queryString;
}
