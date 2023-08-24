import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Reminder schedule hourly', function() {

    var agent = request.agent(infra._app);

    it('51 - Negative - Add hourly schedule', function(done) {
        loadReminderHourCreateModel();
        const createModel = getTestData("ReminderHourModel");
        agent
            .post(`/api/v1/reminders/repeat-every-hour/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(422, done);
    });

    it('Negative Get hourly schedule by id', function(done) {

        agent
            .get(`/api/v1/reminders/${getTestData('ReminderHour')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0VNC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderHourCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : "Drink Water",
        WhenTime             : "13:34:12",
        HookUrl              : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        StartDate            : "2023-10-12T00:00:00.000Z",
        EndDate              : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions : 5,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderHourCreateModel");
};
