import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Notice tests', function() {

    var agent = request.agent(infra._app);

    it('442 - Create Notice', function(done) {
        loadNoticeCreateModel();
        const createModel = getTestData("NoticeCreateModel");
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notice.id, 'NoticeId');
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                setTestData(response.body.Data.Notice.id, 'NoticeId');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.PostDate).to.equal(getTestData("NoticeCreateModel").PostDate);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.IsActive).to.equal(getTestData("NoticeCreateModel").IsActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
            })
            .expect(201, done);
    });

    it('443 - Get Notice by id', function(done) {

        agent
            .get(`/api/v1/general/notices/${getTestData('NoticeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.PostDate).to.equal(getTestData("NoticeCreateModel").PostDate);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.IsActive).to.equal(getTestData("NoticeCreateModel").IsActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
                
            })
            .expect(200, done);
    });

    it('444 - Search records', function(done) {
        loadNoticeQueryString();
        agent
            .get(`/api/v1/general/notices/search${loadNoticeQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.NoticeRecords).to.have.property('TotalCount');
                expect(response.body.Data.NoticeRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.NoticeRecords).to.have.property('PageIndex');
                expect(response.body.Data.NoticeRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.NoticeRecords).to.have.property('Order');
                expect(response.body.Data.NoticeRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.NoticeRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.NoticeRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('445 - Update Notice', function(done) {
        loadNoticeUpdateModel();
        const updateModel = getTestData("NoticeUpdateModel");
        agent
            .put(`/api/v1/general/notices/${getTestData('NoticeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeUpdateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeUpdateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeUpdateModel").Link);
                expect(response.body.Data.Notice.PostDate).to.equal(getTestData("NoticeUpdateModel").PostDate);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeUpdateModel").DaysActive);
                expect(response.body.Data.Notice.IsActive).to.equal(getTestData("NoticeUpdateModel").IsActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeUpdateModel").ImageUrl);

            })
            .expect(200, done);
    });

    it('446 - Delete Notice', function(done) {
      
        agent
            .delete(`/api/v1/general/notices/${getTestData('NoticeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notice again', function(done) {
        loadNoticeCreateModel();
        const createModel = getTestData("NoticeCreateModel");
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notice.id, 'NoticeId');
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                setTestData(response.body.Data.Notice.id, 'NoticeId');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.PostDate).to.equal(getTestData("NoticeCreateModel").PostDate);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.IsActive).to.equal(getTestData("NoticeCreateModel").IsActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNoticeCreateModel = async (
) => {
    const model = {
        Title       : "Platform engineer",
        Description : "Firstly you will have to check for what violation you’ve received the show cause notice. If you really failed to conduct an AGM according to the timeline provided, your reply should contain acceptance of non-compliance and prayer for imposing low penalty due to the small size of the company. There shall be no loss to the shareholders and the general public, no repetitive nature of non-compliance etc. etc.",
        Link        : "https://github.com/REAN-Foundation/reancare-service",
        PostDate    : "2022-08-03T00:00:00.000Z",
        DaysActive  : 7,
        Tags        : ["Popular", "HotNews"],
        IsActive    : false,
        ImageUrl    : "https://www.complybook.com/images/blogs/original/1667016702Import%20of%20Milk%20and%20Milk%20Products.jpg",
        Action      : "Apply for job"
    };
    setTestData(model, "NoticeCreateModel");
};

export const loadNoticeUpdateModel = async (
) => {
    const model = {
        Title       : "Job Apply",
        Description : "As per Section 96 of the Companies Act, 2013: Every company other than a One Person Company shall in each year hold in addition to any other meetings, a general meeting as its annual general meeting and shall specify the meeting as such in the notices calling it, and not more than 15 months shall elapse between the date of one annual general meeting of a company and that of the next. Provided that in case of the first annual general meeting, it shall be held within a period of 9 months from the date of closing of the first financial year of the company and in any other case, within a period of 6 months, from the date of closing of the financial year. Now, there are following 2 probabilities for getting a notice for violation of Section 96",
        Link        : "https://amritmahotsav.nic.in/",
        PostDate    : "2022-08-03T00:00:00.000Z",
        DaysActive  : 7,
        Tags        : ["Popular", "Hot"],
        IsActive    : false,
        ImageUrl    : "https://www.complybook.com/images/blogs/original/1584935885ReplyToShowCauseNoticeReceivedMCAComplianceManagementSystem.png"
    };
    setTestData(model, "NoticeUpdateModel");
};

function loadNoticeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=Platform engineer';
    return queryString;
}
