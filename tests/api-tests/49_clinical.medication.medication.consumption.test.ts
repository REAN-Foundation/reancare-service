import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';
import {
    MedicationAdministrationRoutes,
    MedicationDosageUnits,
    MedicationDurationUnits,
    MedicationFrequencyUnits,
    MedicationTimeSchedules
} from '../../src/domain.types/clinical/medication/medication/medication.types';
import { getRandomEnumValue } from './utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('49 - Medication consumption tests', function() {

    var agent = request.agent(infra._app);

    it('49 - 01 - Get medication consumption list', function(done) {
        loadMedicationConsumptionQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/search-for-patient/${getTestData("PatientUserId")}${loadMedicationConsumptionQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('49 - 02 - Get medication schedule for duration in future', function(done) {
    //     loadFutureQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-duration/${getTestData("PatientUserId")}${loadFutureQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('49 - 03 - Get medication schedule for duration in past', function(done) {
    //     loadPastQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-duration/${getTestData("PatientUserId")}${loadPastQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('49 - 04 - Get medication summary for day', function(done) {
        loadSummaryQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-day/${getTestData("PatientUserId")}/2021-06-22${loadSummaryQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('49 - 05 - Get medication schedules for day', function(done) {
    //     loadDayQueryString();
    //     agent
    //         .get(`/api/v1/clinical/medication-consumptions/schedule-for-day/${getTestData("PatientUserId")}/2023-10-14${loadDayQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('49 - 06 - Get medication consumption summary for calendar months', function(done) {
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-calendar-months/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('49 - 07 - Mark as taken', function(done) {
    //     agent
    //         .put(`/api/v1/clinical/medication-consumptions/mark-as-taken/${getTestData('MedicationId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('49 - 08 - Mark list of medication consumptions as taken', function(done) {
    //     agent
    //         .put(`/api/v1/clinical/medication-consumptions/mark-list-as-taken`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('49 - 09 - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('49 - 10 - Delete future medication consumptions', function(done) {
        agent
            .post(`/api/v1/clinical/medication-consumptions/delete-future-schedules/${getTestData("MedicationDrugId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('49 - 11 - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('MedicationDrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('49 - 01 - Negative - Get medication consumption list', function(done) {
        loadMedicationConsumptionQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/search-for-patient/${getTestData("PatientUserId")}${loadMedicationConsumptionQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('49 - 02 - Negative - Get medication summary for day', function(done) {
        loadSummaryQueryString();
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-day/${getTestData("PatientUserId")}/2011-06-22${loadSummaryQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('49 - 03 - Negative - Get medication consumption summary for calendar months', function(done) {
        agent
            .get(`/api/v1/clinical/medication-consumptions/summary-for-calendar-months/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('49 - 04 - Negative - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('49 - 05 - Negative - Delete future medication consumptions', function(done) {
        agent
            .post(`/api/v1/clinical/medication-consumptions/delete-future-schedules/${getTestData("MedicationDrugId")}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('49 - 06 - Negative - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('MedicationDrugId')}`)
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

function loadMedicationConsumptionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadFutureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadPastQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadSummaryQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadDayQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadMedicationCreateModel = async (
    DrugName = faker.lorem.word(),
    Dose = faker.number.int(10),
    Frequency = faker.number.int(10),
    Duration = faker.number.int(60),
    refillNeeded = faker.datatype.boolean(),
    Instructions = faker.lorem.words(10),
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugName      : DrugName,
        Dose          : Dose,
        DosageUnit    : medicationDosageUnits,
        TimeSchedules : [
            medicationTimeSchedules
        ],
        Frequency     : Frequency,
        FrequencyUnit : medicationFrequencyUnits,
        Route         : medicationAdministrationRoutes,
        Duration      : Duration,
        DurationUnit  : medicationDurationUnits,
        StartDate     : "2023-09-14",
        RefillNeeded  : refillNeeded,
        Instructions  : Instructions,
    };
    setTestData(model, "MedicationCreateModel");
};

export const loadMedicationDrugIdCreateModel = async (
    Dose = faker.number.int(10),
    Duration = faker.number.int(60),
    refillNeeded = faker.datatype.boolean(),
    refillCount = faker.number.int(10),
    Instructions = faker.lorem.words(10),
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugId        : getTestData("DrugId"),
        Dose          : Dose,
        DosageUnit    : medicationDosageUnits,
        TimeSchedules : [
            medicationTimeSchedules
        ],
        FrequencyUnit : medicationFrequencyUnits,
        Route         : medicationAdministrationRoutes,
        Duration      : Duration,
        DurationUnit  : medicationDurationUnits,
        StartDate     : "2023-10-14",
        RefillNeeded  : refillNeeded,
        RefillCount   : refillCount,
        Instructions  : Instructions
    };
    setTestData(model, "MedicationDrugIdCreateModel");
};

export const loadMedicationUpdateModel = async (
    Dose = faker.number.int(10),
    Frequency = faker.number.int(10),
    Duration = faker.number.int(60),
    refillNeeded = faker.datatype.boolean(),
    Instructions = faker.lorem.words(10),
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Dose          : Dose,
        DosageUnit    : medicationDosageUnits,
        TimeSchedules : [
            medicationTimeSchedules
        ],
        Frequency     : Frequency,
        FrequencyUnit : medicationFrequencyUnits,
        Route         : medicationAdministrationRoutes,
        Duration      : Duration,
        DurationUnit  : medicationDurationUnits,
        StartDate     : "2023-09-14",
        RefillNeeded  : refillNeeded,
        Instructions  : Instructions,
    };
    setTestData(model, "MedicationUpdateModel");
};

function loadMedicationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

const medicationDosageUnits = getRandomEnumValue(MedicationDosageUnits);

const medicationTimeSchedules = getRandomEnumValue(MedicationTimeSchedules);

const medicationFrequencyUnits = getRandomEnumValue(MedicationFrequencyUnits);

const medicationAdministrationRoutes = getRandomEnumValue(MedicationAdministrationRoutes);

const medicationDurationUnits = getRandomEnumValue(MedicationDurationUnits);

