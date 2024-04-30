import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('20 - Reminder schedule monthly', function () {
    var agent = request.agent(infra._app);

    it('20:01 -> Add monthly reminder on given day', function (done) {
        loadReminderMonthCreateModel();
        const createModel = getTestData('reminderMonthCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderMonthId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderMonthCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderMonthCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderMonthCreateModel').WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderMonthCreateModel').HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderMonthCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('20:02 -> Add monthly reminder on certain day', function (done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData('reminderCertainMonthCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderCertainMonthId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderCertainMonthCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderCertainMonthCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(
                    getTestData('reminderCertainMonthCreateModel').WhenTime
                );
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderCertainMonthCreateModel').HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderCertainMonthCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('20:03 -> Get monthly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderMonthId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);
            })
            .expect(200, done);
    });

    it('20:04 -> Negative - Add monthly reminder on certain day', function (done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData('reminderCertainMonthCreate');
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
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

    it('20:05 -> Negative - Get monthly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderMonthId')}`)
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

export const loadReminderMonthCreateModel = async () => {
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
    setTestData(model, 'reminderMonthCreateModel');
};

export const loadReminderCertainMonthCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: 'Month',
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int(200),
        RepeatList: ['First-Wednesday', 'Last-Friday', 'Second-Saturday'],
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderCertainMonthCreateModel');
};
