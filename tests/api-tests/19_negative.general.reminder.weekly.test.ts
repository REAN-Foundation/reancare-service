import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Reminder schedule weekly', function() {

    var agent = request.agent(infra._app);

    it('45 - Negative - Add reminder for every week day', function(done) {
        loadReminderEveryWeekCreateModel();
        const createModel = getTestData("ReminderEveryWeekCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-every-weekday/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(401, done);
    });

    it('46 - Negative - Get weekly reminder by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderEveryWeek')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderEveryWeekCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : "Drink Water",
        WhenTime             : "13:34:12",
        HookUrl              : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        StartDate            : "2023-11-12T00:00:00.000Z",
        EndDate              : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions : 10,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderEveryWeekCreateModel");
};

export const loadReminderCertainWeekCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Month",
        StartDate             : "2023-12-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 5,
        RepeatList            : [
            "Wednesday",
            "Friday"
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainWeekCreateModel");
};
