import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { RepeatAfterEveryNUnit } from '../../../src/domain.types/general/reminder/reminder.domain.model';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('19 - Reminder schedule weekly', function() {

    var agent = request.agent(infra._app);

    it('19:01 -> Add reminder for every week day', function(done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData("ReminderEveryWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderEveryWeekCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('19:02 -> Add reminder for certain week day', function(done) {
        loadReminderCertainWeekCreateModel();
        const createModel = getTestData("ReminderCertainWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-week-on-days/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCertainWeekCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('19:03 -> Get weekly reminder by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderEveryWeekId')}`)
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

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderEveryWeekCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderEveryWeekCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderEveryWeekCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderEveryWeekCreateModel").HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderEveryWeekCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

    it('19:04 -> Negative - Add reminder for every week day', function(done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData("ReminderEveryWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(401, done);
    });

    it('19:05 -> Negative - Get weekly reminder by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderEveryWeekId')}`)
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

export const loadReminderEveryWeekCreateModel = async (
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
    setTestData(model, "ReminderEveryWeekCreateModel");
};

export const loadReminderCertainWeekCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12",
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int(200),
        RepeatList            : [
            faker.date.weekday()
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainWeekCreateModel");
};

