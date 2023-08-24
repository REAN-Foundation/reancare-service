import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Reminder schedule every n tests', function() {

    var agent = request.agent(infra._app);

    it('87 - Add reminder which repeats after every 10 days', function(done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData("ReminderTenDaysCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTenDayId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderTenDayId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTenDaysCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTenDaysCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTenDaysCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTenDaysCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTenDaysCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderTenDaysCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderTenDaysCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderTenDaysCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTenDaysCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('88 - Add reminder which repeats after every 3 months', function(done) {
        loadReminderThreeMonthsCreateModel();
        const createModel = getTestData("ReminderThreeMonthsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderThreeMonthId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderThreeMonthId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderThreeMonthsCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderThreeMonthsCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderThreeMonthsCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderThreeMonthsCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderThreeMonthsCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderThreeMonthsCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderThreeMonthsCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderThreeMonthsCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderThreeMonthsCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('89 - Add reminder which repeats after every 2 quarters', function(done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData("ReminderTwoQuartersCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTwoQuarterId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderTwoQuarterId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTwoQuartersCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTwoQuartersCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTwoQuartersCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTwoQuartersCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTwoQuartersCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderTwoQuartersCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderTwoQuartersCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderTwoQuartersCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTwoQuartersCreateModel").EndAfterNRepetitions);
    
            })
            .expect(201, done);
    });

    it('90 - Add reminder which repeats after every 2 years', function(done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData("ReminderTwoYearsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTwoYearId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
                expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderTwoYearId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTwoYearsCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTwoYearsCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTwoYearsCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTwoYearsCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTwoYearsCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderTwoYearsCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderTwoYearsCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderTwoYearsCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTwoYearsCreateModel").EndAfterNRepetitions);
  
            })
            .expect(201, done);
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

