import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Medication tests', function() {

    var agent = request.agent(infra._app);

    it('132 - Negative - Get a list of drugs from database', function(done) {
        loadDrugQueryString();
        agent
            .get(`/api/v1/clinical/drugs/search${loadDrugQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0VNC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('133 - Negative - Get a list of medication-duration-units', function(done) {
        agent
            .get(`/api/v1/clinical/medications/duration-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('134 - Negative - Get a list of medication-frequency units', function(done) {
        agent
            .get(`/api/v1/clinical/medications/frequency-units/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('135 - Negative - Get medication stock image by id', function(done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/1111`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('136 - Negative - Add new medication by drug name', function(done) {
        loadMedicationCreateModel();
        const createModel = getTestData("MedicationCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('137 - Negative - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'p26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('138 - Negative - Get current patient medications', function(done) {
        agent
            .get(`/api/v1/clinical/medications/current/${getTestData('PatientUser')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('139 - Negative - Get medication by id', function(done) {
    
        agent
            .get(`/api/v1/clinical/medications/${getTestData('Medication')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('140 - Negative - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('Medication')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadDrugQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=cres';
    return queryString;
}

export const loadMedicationCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "MedicationCreateModel");
};

export const loadMedicationDrugIdCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Dose          : 1.5,
        DosageUnit    : "Tablet",
        TimeSchedules : [
            "Morning",
            "Afternoon"
        ],
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : 2,
        DurationUnit  : "Days",
        StartDate     : "2023-10-14",
        RefillNeeded  : true,
        RefillCount   : 2,
        Instructions  : "If there is reaction or allergy, please contact immediately."
    };
    setTestData(model, "MedicationDrugIdCreateModel");
};

export const loadMedicationUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        // DrugName      : "Paracetamol",
        Dose          : 2,
        DosageUnit    : "liquid",
        TimeSchedules : [
            "Morning",
            "Afternoon",
            "Evening",
            "Night"
        ],
        Frequency     : 4,
        FrequencyUnit : "weekly",
        Route         : "Oral",
        Duration      : 10,
        DurationUnit  : "weeks",
        StartDate     : "2023-09-14",
        RefillNeeded  : false,
        Instructions  : "If there is reaction or allergy, please contact immediately.",
    };
    setTestData(model, "MedicationUpdateModel");
};
