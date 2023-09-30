import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('22 - Reminder schedule hourly', function() {

    var agent = request.agent(infra._app);

    it('22:01 -> Add hourly schedule', function(done) {
        loadReminderHourCreateModel();
        const createModel = getTestData("ReminderHourCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderHourCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('22:02 -> Get hourly schedule by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderHourId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderHourCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

    it('22:03 -> Negative - Add hourly schedule', function(done) {
        loadReminderHourCreateModel();
        const createModel = getTestData("ReminderHourModel");
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(422, done);
    });

    it('22:04 -> Negative Get hourly schedule by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderHourId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderHourCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : faker.person.fullName(),
        WhenTime             : "12:10:12",
        HookUrl              : faker.internet.url(),
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions : faker.number.int(200),
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderHourCreateModel");
};

