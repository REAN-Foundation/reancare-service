import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, futureDateString, getRandomEnumValue, pastDateString, startDate } from '../utils';
import { BloodGroupList, MaritalStatusList, Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { MedicationDurationUnits, MedicationTimeSchedules } from '../../../src/domain.types/clinical/medication/medication/medication.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('93 - tests', function() {

    var agent = request.agent(infra._app);
   
    it('93:01 -> Get contact person role test', function(done) {
      agent
        .get(`/api/v1/patient-emergency-contacts/roles/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
        .expect(response => {
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');
        })
        .expect(200, done);
  });

  it('93:02 -> Create patient goal test', function(done) {
    loadPatientGoalCreateModel();
    const createModel = getTestData("PatientGoalCreateModel");
    agent
        .post(`/api/v1/patient-goals/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
        .send(createModel)
        .expect(response => {
            setTestData(response.body.Data.Goal.id, 'PatientGoalId_1');
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');

        })
        .expect(201, done);
  });
  
  it('93:03 -> Create One time reminder test', function(done) {
    loadOneTimeReminderCreateModel();
    const createModel = getTestData("OneTimeReminderCreateModel");
    agent
        .post(`/api/v1/reminders/one-time/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
        .send(createModel)
        .expect(response => {
            setTestData(response.body.Data.Reminder.id, 'OneTimeReminderId_1');
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');

        })
        .expect(201, done);
  });

  it('93:04 -> Add new medication by drug name test', function(done) {
    loadMedicationCreateModel();
    const createModel = getTestData("MedicationCreateModel");
    agent
        .post(`/api/v1/clinical/medications/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
        .send(createModel)
        .expect(response => {
            setTestData(response.body.Data.Medication.id, 'MedicationId_1');
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');

        })
        .expect(201, done);
  });

  it('93:05 -> Get medication consumption list', function(done) {
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

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientGoalCreateModel = async (
  ) => {
      const model = {
          PatientUserId : getTestData("PatientUserId"),
          Title         : faker.lorem.word(),
          CarePlanId    : faker.string.uuid(),
          TypeCode      : faker.string.uuid(),
          TypeName      : faker.company.name(),
          GoalAchieved  : faker.datatype.boolean(),
          GoalAbandoned : faker.datatype.boolean()
    
      };
      setTestData(model, "PatientGoalCreateModel");
};

export const loadOneTimeReminderCreateModel = async (
  ) => {
      const model = {
          UserId           : getTestData("PatientUserId"),
          Name             : faker.person.fullName(),
          WhenDate         : futureDateString,
          WhenTime         : "12:10:12",
          HookUrl          : faker.internet.url(),
          NotificationType : "SMS"
  
      };
      setTestData(model, "OneTimeReminderCreateModel");
};

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

function loadMedicationConsumptionQueryString() {
  //This is raw query. Please modify to suit the test
  const queryString = '';
  return queryString;
};

  