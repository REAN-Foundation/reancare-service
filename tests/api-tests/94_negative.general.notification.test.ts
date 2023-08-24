import  request  from 'supertest';
import { expect, } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Notification tests', function() {

    var agent = request.agent(infra._app);

    it('254 - Negative - Create Notification', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('255 - Negative - Get Notification by id', function(done) {

        agent
            .get(`/api/v1/general/notifications/${getTestData('Notification')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('256 - Negative - Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}/mark-as-read`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(403, done);
    });

    it('257 - Negative - Update Notification', function(done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData("NotificationUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNotificationCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "NotificationCreateModel");
};

export const loadMarkUpdateModel = async (
) => {
    const model = {
        ReadOn : "2022-09-20T00:00:00.000Z"
    };
    setTestData(model, "MarkUpdateModel");
};

export const loadNotificationUpdateModel = async (
) => {
    const model = {
        Title    : "Job posting",
        Body     : "abcs",
        SentOn   : "2022-09-20T00:00:00.000Z",
        ImageUrl : "https://github.com/REAN-Foundation/reancare-service/pull/290",
        Type     : "General"
    };
    setTestData(model, "NotificationUpdateModel");
};
