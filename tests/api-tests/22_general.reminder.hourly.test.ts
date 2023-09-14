import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';
import { NotificationType } from '../../src/domain.types/general/reminder/reminder.domain.model';
import { getRandomEnumValue, whenTime } from './utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('22 - Reminder schedule hourly', function() {

    var agent = request.agent(infra._app);

    it('22 - 01 - Add hourly schedule', function(done) {
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

    it('22 - 02 - Get hourly schedule by id', function(done) {

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

    it('22 - 01 - Negative - Add hourly schedule', function(done) {
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

    it('22 - 02- Negative Get hourly schedule by id', function(done) {

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
    Name = faker.person.fullName(),
    hookUrl = faker.internet.url(),
    startDate = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-05T00:00:00.000Z' }),
    endDate = faker.date.between({ from: '2024-06-06T00:00:00.000Z', to: '2024-11-11T00:00:00.000Z' }),
    endAfterNRepetitions = faker.number.int(200),
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : Name,
        WhenTime             : "12:10:12",
        HookUrl              : hookUrl,
        StartDate            : startDate,
        EndDate              : endDate,
        EndAfterNRepetitions : endAfterNRepetitions,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderHourCreateModel");
};

const notificationType = getRandomEnumValue(NotificationType);
