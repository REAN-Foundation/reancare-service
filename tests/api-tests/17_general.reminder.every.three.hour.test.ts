import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';
import { NotificationType, RepeatAfterEveryNUnit } from '../../src/domain.types/general/reminder/reminder.domain.model';
import { getRandomEnumValue, whenTime } from './utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('17 - Reminder schedule every 3 hours tests', function() {

    var agent = request.agent(infra._app);

    it('17 - 01 - Create reminder every 3 hours', function(done) {
        const ReminderCreateModel = getTestData("ReminderCreateModel");
        ReminderCreateModel.UserId = getTestData("PatientUserId");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(ReminderCreateModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId_1');
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

                setTestData(response.body.Data.Reminder.id, 'Reminder3HourId_1');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
       
    });

    it('17 - 02 - Get reminder every 3 hours by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('Reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
            })
            .expect(200, done);
    });

    it('17 - 03 - Search reminder every 3 hours records', function(done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('17 - 04 - Delete reminder every 3 hours', function(done) {
      
        agent
            .delete(`/api/v1/reminders/${getTestData('Reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('17 - 01 - Negative - Create reminder every 3 hours', function(done) {
        loadReminderCreateModel();
        const createModel = getTestData("ReminderCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(401, done);
    });

    it('17 - 02 - Negative - Search reminder every 3 hours records', function(done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('17 - 03 - Negative - Delete reminder every 3 hours', function(done) {
      
        agent
            .delete(`/api/v1/reminders/${getTestData('Reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderCreateModel = async (
    Name = faker.person.fullName(),
    // whenTime = faker.setDefaultRefTime(new Date('13:34:12')),
    hookUrl = faker.internet.url(),
    repeatAfterEvery = faker.number.int(100),
    startDate = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-05T00:00:00.000Z' }),
    endDate = faker.date.between({ from: '2024-06-06T00:00:00.000Z', to: '2024-11-11T00:00:00.000Z' }),
    endAfterNRepetitions = faker.number.int(200),
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : Name,
        WhenTime              : whenTime.toLocaleTimeString(),
        HookUrl               : hookUrl,
        RepeatAfterEvery      : repeatAfterEvery,
        RepeatAfterEveryNUnit : repeatAfterEveryNUnit,
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : endAfterNRepetitions,
        NotificationType      : notificationType
  
    };
    setTestData(model, "ReminderCreateModel");
};

function loadReminderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

const notificationType = getRandomEnumValue(NotificationType);

const repeatAfterEveryNUnit = getRandomEnumValue(RepeatAfterEveryNUnit);
