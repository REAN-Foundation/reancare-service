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

describe('18 - Reminder schedule every n tests', function () {
    var agent = request.agent(infra._app);

    it('18:01 -> Add reminder which repeats after every 10 days', function (done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData('reminderTenDaysCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderTenDayId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderTenDaysCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderTenDaysCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderTenDaysCreateModel').WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderTenDaysCreateModel').HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(
                    getTestData('reminderTenDaysCreateModel').RepeatAfterEvery
                );
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderTenDaysCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('18:02 -> Add reminder which repeats after every 3 months', function (done) {
        loadReminderThreeMonthsCreateModel();
        const createModel = getTestData('reminderThreeMonthsCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderThreeMonthId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderThreeMonthsCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderThreeMonthsCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(
                    getTestData('reminderThreeMonthsCreateModel').WhenTime
                );
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderThreeMonthsCreateModel').HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(
                    getTestData('reminderThreeMonthsCreateModel').RepeatAfterEvery
                );
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderThreeMonthsCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('18:03 -> Add reminder which repeats after every 2 quarters', function (done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData('reminderTwoQuartersCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderTwoQuarterId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderTwoQuartersCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderTwoQuartersCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(
                    getTestData('reminderTwoQuartersCreateModel').WhenTime
                );
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderTwoQuartersCreateModel').HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(
                    getTestData('reminderTwoQuartersCreateModel').RepeatAfterEvery
                );
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderTwoQuartersCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('18:04 -> Add reminder which repeats after every 2 years', function (done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData('reminderTwoYearsCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderTwoYearId');
                expectReminderProperties(response);

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderTwoYearsCreateModel').UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderTwoYearsCreateModel').Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderTwoYearsCreateModel').WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderTwoYearsCreateModel').HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(
                    getTestData('reminderTwoYearsCreateModel').RepeatAfterEvery
                );
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
                    getTestData('reminderTwoYearsCreateModel').EndAfterNRepetitions
                );
            })
            .expect(201, done);
    });

    it('18:05 -> Negative - Add reminder which repeats after every 10 days', function (done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData('reminderTenDaysCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('18:06 -> Negative - Add reminder which repeats after every 2 quarters', function (done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData('reminderTwoQuartersCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('18:07 -> Negative - Add reminder which repeats after every 2 years', function (done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData('reminderTwoYearsCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
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
    expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
    expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
    expect(response.body.Data.Reminder).to.have.property('StartDate');
    expect(response.body.Data.Reminder).to.have.property('EndDate');
    expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');
}

export const loadReminderTenDaysCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int({ max: 200 }),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderTenDaysCreateModel');
};

export const loadReminderThreeMonthsCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: 'Hour',
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int({ max: 200 }),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderThreeMonthsCreateModel');
};

export const loadReminderTwoQuartersCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int({ max: 200 }),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderTwoQuartersCreateModel');
};

export const loadReminderTwoYearsCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int({ max: 200 }),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderTwoYearsCreateModel');
};
