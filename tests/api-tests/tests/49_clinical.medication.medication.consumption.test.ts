import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import {
    MedicationAdministrationRoutes,
    MedicationDosageUnits,
    MedicationDurationUnits,
    MedicationFrequencyUnits,
    MedicationTimeSchedules
} from '../../../src/domain.types/clinical/medication/medication/medication.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('49 - Medication consumption tests', function() {

    var agent = request.agent(infra._app);

    it('49:01 -> Get medication consumption list', function(done) {
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

    it('49:02 -> Get medication summary for day', function(done) {
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

    it('49:03 -> Get medication consumption summary for calendar months', function(done) {
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

    it('49:04 -> Add new medication by drug id', function(done) {
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

    it('49:05 -> Delete future medication consumptions', function(done) {
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

    it('49:06 -> Delete Medication', function(done) {
       
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

    it('49:07 -> Negative - Get medication consumption list', function(done) {
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

    it('49:08 -> Negative - Get medication summary for day', function(done) {
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

    it('49:09 -> Negative - Get medication consumption summary for calendar months', function(done) {
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

    it('49:10 -> Negative - Add new medication by drug id', function(done) {
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

    it('49:11 -> Negative - Delete future medication consumptions', function(done) {
        agent
            .post(`/api/v1/clinical/medication-consumptions/delete-future-schedules/${getTestData("MedicationDrugId")}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('49:12 -> Negative - Delete Medication', function(done) {
       
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
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugName      : faker.lorem.word(),
        Dose          : faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit    : "Tablet",
        TimeSchedules : [
            getRandomEnumValue(MedicationTimeSchedules)
        ],
        Frequency     : faker.number.int({ min: 2, max: 4 }),
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : faker.number.int({ min: 10, max: 20 }),
        DurationUnit  : getRandomEnumValue(MedicationDurationUnits),
        StartDate     : "2023-09-14",
        RefillNeeded  : faker.datatype.boolean(),
        Instructions  : faker.lorem.words(),
    };
    setTestData(model, "MedicationCreateModel");
};

export const loadMedicationDrugIdCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugId        : getTestData("DrugId"),
        Dose          : faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit    : "Tablet",
        TimeSchedules : [
            getRandomEnumValue(MedicationTimeSchedules)
        ],
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : faker.number.int({ min: 10, max: 20 }),
        DurationUnit  : getRandomEnumValue(MedicationDurationUnits),
        StartDate     : "2023-10-14",
        RefillNeeded  : faker.datatype.boolean(),
        RefillCount   : faker.number.int({ min:2, max: 5 }),
        Instructions  : faker.lorem.words()
    };
    setTestData(model, "MedicationDrugIdCreateModel");
};

export const loadMedicationUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Dose          : faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit    : "Tablet",
        TimeSchedules : [
            getRandomEnumValue(MedicationTimeSchedules)
        ],
        Frequency     : faker.number.int({ min: 2, max: 4 }),
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : faker.number.int({ min: 10, max: 20 }),
        DurationUnit  : getRandomEnumValue(MedicationDurationUnits),
        StartDate     : "2023-09-14",
        RefillNeeded  : faker.datatype.boolean(),
        Instructions  : faker.lorem.words(),
    };
    setTestData(model, "MedicationUpdateModel");
};

function loadMedicationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}


