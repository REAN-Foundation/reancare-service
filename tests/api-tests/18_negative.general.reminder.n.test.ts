import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Reminder schedule every n tests', function() {

    var agent = request.agent(infra._app);

    it('42 - Negative - Add reminder which repeats after every 10 days', function(done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData("ReminderTenDaysCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(403, done);
    });

    it('43 - Negative - Add reminder which repeats after every 2 quarters', function(done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData("ReminderTwoQuartersCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYEJB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
    
            })
            .expect(403, done);
    });

    it('44 - Negative - Add reminder which repeats after every 2 years', function(done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData("ReminderTwoYearsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
  
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderTenDaysCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 10,
        RepeatAfterEveryNUnit : "Day",
        StartDate             : "2023-08-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
  
    };
    setTestData(model, "ReminderTenDaysCreateModel");
};

export const loadReminderThreeMonthsCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Month",
        StartDate             : "2023-08-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
    
    };
    setTestData(model, "ReminderThreeMonthsCreateModel");
};

export const loadReminderTwoQuartersCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 2,
        RepeatAfterEveryNUnit : "Quarter",
        StartDate             : "2023-08-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
      
    };
    setTestData(model, "ReminderTwoQuartersCreateModel");
};

export const loadReminderTwoYearsCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 2,
        RepeatAfterEveryNUnit : "Year",
        StartDate             : "2023-08-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
        
    };
    setTestData(model, "ReminderTwoYearsCreateModel");
};

