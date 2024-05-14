import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('22 - Reminder schedule hourly', function () {
    var agent = request.agent(infra._app);

    it('22:01 -> Add hourly schedule', function (done) {
        loadReminderHourCreateModel();
        const createModel = getTestData('reminderHourCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderHourId');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('22:02 -> Get hourly schedule by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderHourId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(200, done);
    });

    it('22:03 -> Negative - Add hourly schedule', function (done) {
        loadReminderHourCreateModel();
        const createModel = getTestData('reminderHourModel');
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('22:04 -> Negative Get hourly schedule by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderHourId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setReminderId(response, key) {
    setTestData(response.body.Data.Reminder.id, key);
}

function expectReminderProperties(response) {
    expect(response.body.Data.Reminder).to.have.property('id');
    expect(response.body.Data.Reminder).to.have.property('UserId');
    expect(response.body.Data.Reminder).to.have.property('Name');
    expect(response.body.Data.Reminder).to.have.property('WhenTime');
    expect(response.body.Data.Reminder).to.have.property('HookUrl');
    expect(response.body.Data.Reminder).to.have.property('StartDate');
    expect(response.body.Data.Reminder).to.have.property('EndDate');
    expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');
}

function expectReminderPropertyValues(response) {
    expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderHourCreateModel').UserId);
    expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderHourCreateModel').Name);
    expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderHourCreateModel').WhenTime);
    expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderHourCreateModel').HookUrl);
    expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
        getTestData('reminderHourCreateModel').EndAfterNRepetitions
    );
}

export const loadReminderHourCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int(200),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderHourCreateModel');
};
