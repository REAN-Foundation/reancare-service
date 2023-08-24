import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negativev Medication consumption tests', function() {

    var agent = request.agent(infra._app);

    it('141 - Negative - Get medication consumption list', function(done) {
        loadMedicationConsumptionQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/search-for-patient/${getTestData("PatientUser")}${loadMedicationConsumptionQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('142 - Negative - Get medication summary for day', function(done) {
        loadSummaryQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-day/${getTestData("PatientUserId")}/2011-06-22${loadSummaryQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('143 - Negative - Get medication consumption summary for calendar months', function(done) {
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-calendar-months/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('144 - Negative - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
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

    it('145 - Negative - Delete future medication consumptions', function(done) {
        agent
            .post(`/api/v1/clinical/medication-consumptions/delete-future-schedules/${getTestData("MedicationDrug")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('146 - Negative - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('MedicationDrug')}`)
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

function loadMedicationConsumptionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?fromDate=2023-05-21&toDate=2023-09-21';
    return queryString;
}

function loadSummaryQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?groupByDrug=true';
    return queryString;
}

export const loadMedicationCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugName      : "Generic Tamiflu",
        Dose          : 1,
        DosageUnit    : "Tablet",
        TimeSchedules : [
            "Morning",
            "Afternoon",
            "Evening",
            "Night"
        ],
        Frequency     : 4,
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : 20,
        DurationUnit  : "Days",
        StartDate     : "2023-09-14",
        RefillNeeded  : false,
        Instructions  : "If there is reaction or allergy, please contact immediately.",
    };
    setTestData(model, "MedicationCreateModel");
};

export const loadMedicationDrugIdCreateModel = async (
) => {
    const model = {
    
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

