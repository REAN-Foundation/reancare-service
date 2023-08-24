import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Reminder schedule every 3 hours tests', function() {

    var agent = request.agent(infra._app);

    it('83 - Create reminder every 3 hours', function(done) {
        loadReminderCreateModel();
        const createModel = getTestData("ReminderCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId');
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

                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('84 - Get reminder every 3 hours by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('Reminder3HourId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

    it('85 - Search reminder every 3 hours records', function(done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Reminders).to.have.property('TotalCount');
                expect(response.body.Data.Reminders).to.have.property('RetrievedCount');
                expect(response.body.Data.Reminders).to.have.property('PageIndex');
                expect(response.body.Data.Reminders).to.have.property('ItemsPerPage');
                expect(response.body.Data.Reminders).to.have.property('Order');
                expect(response.body.Data.Reminders.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Reminders.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Reminders.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('86 - Delete reminder every 3 hours', function(done) {
      
        agent
            .delete(`/api/v1/reminders/${getTestData('Reminder3HourId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create reminder every 3 hours again', function(done) {
        loadReminderCreateModel();
        const createModel = getTestData("ReminderCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId');
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

                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.RepeatAfterEveryNUnit).to.equal(getTestData("ReminderCreateModel").RepeatAfterEveryNUnit);
                expect(response.body.Data.Reminder.StartDate).to.equal(getTestData("ReminderCreateModel").StartDate);
                expect(response.body.Data.Reminder.EndDate).to.equal(getTestData("ReminderCreateModel").EndDate);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Hour",
        StartDate             : "2023-10-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
  
    };
    setTestData(model, "ReminderCreateModel");
};

function loadReminderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?createdDateFrom=2023-10-12';
    return queryString;
}
