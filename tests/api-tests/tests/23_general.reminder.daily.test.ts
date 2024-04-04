import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('23 - Reminder schedule daily', function() {

    var agent = request.agent(infra._app);

    it('23:01 -> Add daily schedule', function(done) {
        loadReminderDailyCreateModel();
        const createModel = getTestData("ReminderDailyCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-day/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderDailyId');
                expect(response.body.Data.Reminder).to.have.property('id');
                expect(response.body.Data.Reminder).to.have.property('UserId');
                expect(response.body.Data.Reminder).to.have.property('Name');
                expect(response.body.Data.Reminder).to.have.property('WhenTime');
                expect(response.body.Data.Reminder).to.have.property('HookUrl');
                expect(response.body.Data.Reminder).to.have.property('StartDate');
                expect(response.body.Data.Reminder).to.have.property('EndDate');
                expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');

                setTestData(response.body.Data.Reminder.id, 'ReminderDailyId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderDailyCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderDailyCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderDailyCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderDailyCreateModel").HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderDailyCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('23:02 -> Get daily schedule by id', function(done) {
        
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderDailyId')}`)
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

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderDailyCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderDailyCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderDailyCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderDailyCreateModel").HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderDailyCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

    it('23:03 -> Negative - Add daily schedule', function(done) {
        loadReminderDailyCreateModel();
        const createModel = getTestData("ReminderDailyCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-day/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(401, done);
    });

    it('23:04 -> Negative Get daily schedule by id', function(done) {
        
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderDailyId')}`)
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

export const loadReminderDailyCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : faker.person.fullName(),
        WhenTime             : "12:10:12",
        HookUrl              : faker.internet.url(),
        StartDate            : startDate,
        EndDate              : endDate,
        EndAfterNRepetitions : faker.number.int(200),
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderDailyCreateModel");
};

