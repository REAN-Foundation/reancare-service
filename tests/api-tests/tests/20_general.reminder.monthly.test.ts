import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('20 - Reminder schedule monthly', function() {

    var agent = request.agent(infra._app);

    it('20:01 -> Add monthly reminder on given day', function(done) {
        loadReminderMonthCreateModel();
        const createModel = getTestData("ReminderMonthCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderMonthCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('20:02 -> Add monthly reminder on certain day', function(done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData("ReminderCertainMonthCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCertainMonthCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('20:03 -> Get monthly reminder by id', function(done) {
    
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderMonthId')}`)
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

            })
            .expect(200, done);
    });

    it('20:04 -> Negative - Add monthly reminder on certain day', function(done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData("ReminderCertainMonthCreate");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
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

    it('20:05 -> Negative - Get monthly reminder by id', function(done) {
    
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderMonthId')}`)
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

export const loadReminderMonthCreateModel = async (
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
    setTestData(model, "ReminderMonthCreateModel");
};

export const loadReminderCertainMonthCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12",
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : "Month",
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int(200),
        RepeatList            : [
            "First-Wednesday",
            "Last-Friday",
            "Second-Saturday"
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainMonthCreateModel");
};

