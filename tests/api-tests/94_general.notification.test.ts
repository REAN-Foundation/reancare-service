import  request  from 'supertest';
import { expect, } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Notification tests', function() {

    var agent = request.agent(infra._app);

    it('436 - Create Notification', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications//`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notification.id, 'NotificationId');
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                setTestData(response.body.Data.Notification.id, 'NotificationId');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.SentOn).to.equal(getTestData("NotificationCreateModel").SentOn);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);

            })
            .expect(201, done);
    });

    it('437 - Get Notification by id', function(done) {

        agent
            .get(`/api/v1/general/notifications/${getTestData('NotificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.SentOn).to.equal(getTestData("NotificationCreateModel").SentOn);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
            })
            .expect(200, done);
    });

    it('438 - Search records', function(done) {
        loadNotificationQueryString();
        agent
            .get(`/api/v1/general/notifications/search${loadNotificationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('439 - Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}/mark-as-read`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ReadOn');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');
                
                expect(response.body.Data.Notification.ReadOn).to.equal(getTestData("MarkUpdateModel").ReadOn);
                
            })
            .expect(200, done);
    });

    it('440 - Update Notification', function(done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData("NotificationUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationUpdateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationUpdateModel").Body);
                expect(response.body.Data.Notification.SentOn).to.equal(getTestData("NotificationUpdateModel").SentOn);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationUpdateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationUpdateModel").Type);

            })
            .expect(200, done);
    });

    it('441 - Delete Notification', function(done) {

        agent
            .delete(`/api/v1/general/notifications/${getTestData('NotificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notification again', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications//`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notification.id, 'NotificationId');
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                setTestData(response.body.Data.Notification.id, 'NotificationId');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.SentOn).to.equal(getTestData("NotificationCreateModel").SentOn);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNotificationCreateModel = async (
) => {
    const model = {
        UserId   : getTestData("PatientUserId"),
        Title    : "You can now limit credit card numbers by card type and country.",
        Body     : "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        SentOn   : "2021-09-12T00:00:00.000Z",
        ImageUrl : "https://picsum.photos/200",
        Type     : "General"
  
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

function loadNotificationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?Type=General';
    return queryString;
}
