import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Reminder schedule monthly', function() {

    var agent = request.agent(infra._app);

    it('94 - Add monthly reminder on given day', function(done) {
        loadReminderMonthCreateModel();
        const createModel = getTestData("ReminderMonthCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderMonthId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderMonthId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderMonthCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderMonthCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderMonthCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderMonthCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderMonthCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderMonthCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderMonthCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('95 - Add monthly reminder on certain day', function(done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData("ReminderCertainMonthCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderCertainMonthId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderCertainMonthId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCertainMonthCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCertainMonthCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCertainMonthCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCertainMonthCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderCertainMonthCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderCertainMonthCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCertainMonthCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('96 - Get monthly reminder by id', function(done) {
    
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderMonthId')}`)
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

export const loadReminderMonthCreateModel = async (
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
    setTestData(model, "ReminderMonthCreateModel");
};

export const loadReminderCertainMonthCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Month",
        StartDate             : "2023-11-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 5,
        RepeatList            : [
            "First-Wednesday",
            "Last-Friday",
            "Second-Saturday"
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainMonthCreateModel");
};
