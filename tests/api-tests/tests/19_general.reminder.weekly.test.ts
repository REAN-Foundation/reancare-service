import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { RepeatAfterEveryNUnit } from '../../../src/domain.types/general/reminder/reminder.domain.model';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('19 - Reminder schedule weekly', function () {
    var agent = request.agent(infra._app);

    it('19:01 -> Add reminder for every week day', function (done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData('reminderEveryWeekCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderEveryWeekId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderEveryWeekCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderEveryWeekCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderEveryWeekCreateModel').WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderEveryWeekCreateModel').HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderEveryWeekCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('19:02 -> Add reminder for certain week day', function (done) {
        loadReminderCertainWeekCreateModel();
        const createModel = getTestData('reminderCertainWeekCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-week-on-days/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderCertainWeekId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderCertainWeekCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderCertainWeekCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(
                    getTestData('reminderCertainWeekCreateModel').WhenTime
                );
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderCertainWeekCreateModel').HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderCertainWeekCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('19:03 -> Get weekly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderEveryWeekId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderEveryWeekCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderEveryWeekCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderEveryWeekCreateModel').WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderEveryWeekCreateModel').HookUrl);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderEveryWeekCreateModel').EndAfterNRepetitions
                );
            })
            .expect(200, done);
    });

    it('19:04 -> Negative - Add reminder for every week day', function (done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData('reminderEveryWeekCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('19:05 -> Negative - Get weekly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderEveryWeekId')}`)
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

export const loadReminderEveryWeekCreateModel = async () => {
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
    setTestData(model, 'reminderEveryWeekCreateModel');
};

export const loadReminderCertainWeekCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int(200),
        RepeatList: [faker.date.weekday()],
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderCertainWeekCreateModel');
};
