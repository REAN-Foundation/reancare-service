import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { futureDateString, getRandomEnumValue } from '../utils';
import {
    MedicationDurationUnits,
    MedicationTimeSchedules,
} from '../../../src/domain.types/clinical/medication/medication/medication.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('106 - tests', function () {
    var agent = request.agent(infra._app);

    it('106:01 -> Get contact person role test', function (done) {
        agent
            .get(`/api/v1/patient-emergency-contacts/roles/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('106:02 -> Create patient goal test', function (done) {
        loadPatientGoalCreateModel();
        const createModel = getTestData('patientGoalCreateModel');
        agent
            .post(`/api/v1/patient-goals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('106:03 -> Create One time reminder test', function (done) {
        loadOneTimeReminderCreateModel();
        const createModel = getTestData('oneTimeReminderCreateModel');
        agent
            .post(`/api/v1/reminders/one-time/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('106:04 -> Add new medication by drug name test', function (done) {
        loadMedicationCreateModel();
        const createModel = getTestData('medicationCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('106:05 -> Get medication consumption list', function (done) {
        loadMedicationConsumptionQueryString();
        agent
            .get(
                `/api/v1/clinical/medication-consumptions/search-for-patient/${getTestData(
                    'patientUserId'
                )}${loadMedicationConsumptionQueryString()}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadPatientGoalCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Title: faker.lorem.word(),
        CarePlanId: faker.string.uuid(),
        TypeCode: faker.string.uuid(),
        TypeName: faker.company.name(),
        GoalAchieved: faker.datatype.boolean(),
        GoalAbandoned: faker.datatype.boolean(),
    };
    setTestData(model, 'patientGoalCreateModel');
};

export const loadOneTimeReminderCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenDate: futureDateString,
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        NotificationType: 'SMS',
    };
    setTestData(model, 'oneTimeReminderCreateModel');
};

export const loadMedicationCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        DrugName: faker.lorem.word(),
        Dose: faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit: 'Tablet',
        TimeSchedules: [getRandomEnumValue(MedicationTimeSchedules)],
        Frequency: faker.number.int({ min: 2, max: 4 }),
        FrequencyUnit: 'Daily',
        Route: 'Oral',
        Duration: faker.number.int({ min: 10, max: 20 }),
        DurationUnit: getRandomEnumValue(MedicationDurationUnits),
        StartDate: '2023-09-14',
        RefillNeeded: faker.datatype.boolean(),
        Instructions: faker.lorem.words(),
    };
    setTestData(model, 'medicationCreateModel');
};

function loadMedicationConsumptionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
