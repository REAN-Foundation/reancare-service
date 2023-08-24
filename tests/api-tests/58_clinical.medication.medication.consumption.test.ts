import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Medication consumption tests', function() {

    var agent = request.agent(infra._app);

    it('252 - Get medication consumption list', function(done) {
        loadMedicationConsumptionQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/search-for-patient/${getTestData("PatientUserId")}${loadMedicationConsumptionQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('254 - Get medication schedule for duration in future', function(done) {
    //     loadFutureQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-duration/${getTestData("PatientUserId")}${loadFutureQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('255 - Get medication schedule for duration in past', function(done) {
    //     loadPastQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-duration/${getTestData("PatientUserId")}${loadPastQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('256 - Get medication summary for day', function(done) {
        loadSummaryQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-day/${getTestData("PatientUserId")}/2021-06-22${loadSummaryQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('257 - Get medication schedules for day', function(done) {
    //     loadDayQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-day/${getTestData("PatientUserId")}/2023-10-14${loadDayQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('258 - Get medication consumption summary for calendar months', function(done) {
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-calendar-months/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('259 - Mark as taken', function(done) {
    //     agent
    //         .put(`/api/v1/clinical/medication-consumptions/mark-as-taken/${getTestData('MedicationId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('260 - Mark list of medication consumptions as taken', function(done) {
    //     agent
    //         .put(`/api/v1/clinical/medication-consumptions/mark-list-as-taken`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('263 - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Medication.id, 'MedicationDrugId');
                expect(response.body.Data.Medication).to.have.property('id');
                expect(response.body.Data.Medication).to.have.property('PatientUserId');
                expect(response.body.Data.Medication).to.have.property('DrugId');
                expect(response.body.Data.Medication).to.have.property('Dose');
                expect(response.body.Data.Medication).to.have.property('DosageUnit');
                expect(response.body.Data.Medication).to.have.property('FrequencyUnit');
                expect(response.body.Data.Medication).to.have.property('Route');
                expect(response.body.Data.Medication).to.have.property('Duration');
                expect(response.body.Data.Medication).to.have.property('DurationUnit');
                expect(response.body.Data.Medication).to.have.property('StartDate');
                expect(response.body.Data.Medication).to.have.property('RefillNeeded');
                expect(response.body.Data.Medication).to.have.property('RefillCount');
                expect(response.body.Data.Medication).to.have.property('Instructions');

                setTestData(response.body.Data.Medication.id, 'MedicationDrugId');

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationDrugIdCreateModel").PatientUserId);
                expect(response.body.Data.Medication.DrugId).to.equal(getTestData("MedicationDrugIdCreateModel").DrugId);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationDrugIdCreateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationDrugIdCreateModel").DosageUnit);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationDrugIdCreateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationDrugIdCreateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationDrugIdCreateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationDrugIdCreateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationDrugIdCreateModel").RefillNeeded);
                expect(response.body.Data.Medication.RefillCount).to.equal(getTestData("MedicationDrugIdCreateModel").RefillCount);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationDrugIdCreateModel").Instructions);

            })
            .expect(201, done);
    });

    it('264 - Delete future medication consumptions', function(done) {
        agent
            .post(`/api/v1/clinical/medication-consumptions/delete-future-schedules/${getTestData("MedicationDrugId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('265 - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('MedicationDrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadMedicationConsumptionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?fromDate=2023-05-21&toDate=2023-09-21';
    return queryString;
}

function loadFutureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?duration=1w&when=future';
    return queryString;
}

function loadPastQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?duration=1w&when=past';
    return queryString;
}

function loadSummaryQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?groupByDrug=true';
    return queryString;
}

function loadDayQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?groupByDrug=true&date=2023-10-14';
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
        PatientUserId : getTestData("PatientUserId"),
        DrugId        : getTestData("DrugId"),
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

function loadMedicationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?drugName=Generic Tamiflu';
    return queryString;
}
