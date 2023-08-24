import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Reminder schedule hourly', function() {

    var agent = request.agent(infra._app);

    it('99 - Add hourly schedule', function(done) {
        loadReminderHourCreateModel();
        const createModel = getTestData("ReminderHourCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderHourId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderHourId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderHourCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderHourCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderHourCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderHourCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderHourCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderHourCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderHourCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('Get hourly schedule by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderHourId')}`)
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

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderHourCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderHourCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderHourCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderHourCreateModel").HookUrl);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderHourCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderHourCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderHourCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderHourCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : "Drink Water",
        WhenTime             : "13:34:12",
        HookUrl              : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        StartDate            : "2023-10-12T00:00:00.000Z",
        EndDate              : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions : 5,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderHourCreateModel");
};
