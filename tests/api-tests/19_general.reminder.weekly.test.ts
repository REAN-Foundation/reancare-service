import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Reminder schedule weekly', function() {

    var agent = request.agent(infra._app);

    it('91 - Add reminder for every week day', function(done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData("ReminderEveryWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderEveryWeekId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderEveryWeekId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderEveryWeekCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderEveryWeekCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderEveryWeekCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderEveryWeekCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderEveryWeekCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderEveryWeekCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderEveryWeekCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('92 - Add reminder for certain week day', function(done) {
        loadReminderCertainWeekCreateModel();
        const createModel = getTestData("ReminderCertainWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-week-on-days/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderCertainWeekId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderCertainWeekId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCertainWeekCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCertainWeekCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCertainWeekCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCertainWeekCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderCertainWeekCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderCertainWeekCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCertainWeekCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('93 - Get weekly reminder by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderEveryWeekId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderEveryWeekCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderEveryWeekCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderEveryWeekCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderEveryWeekCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderEveryWeekCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderEveryWeekCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderEveryWeekCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderEveryWeekCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : "Drink Water",
        WhenTime             : "13:34:12",
        HookUrl              : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        StartDate            : "2023-11-12T00:00:00.000Z",
        EndDate              : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions : 10,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderEveryWeekCreateModel");
};

export const loadReminderCertainWeekCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Month",
        StartDate             : "2023-12-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 5,
        RepeatList            : [
            "Wednesday",
            "Friday"
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainWeekCreateModel");
};
