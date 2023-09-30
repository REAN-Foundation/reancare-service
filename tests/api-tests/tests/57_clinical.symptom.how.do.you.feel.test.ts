import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('57 - How do you feel tests', function() {

    var agent = request.agent(infra._app);

    it('57:01 -> Create how do you feel record', function(done) {
        loadHowDoYouFeelCreateModel();
        const createModel = getTestData("HowDoYouFeelCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/how-do-you-feel/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HowDoYouFeel.id, 'HowDoYouFeelId_1');
                expect(response.body.Data.HowDoYouFeel).to.have.property('id');
                expect(response.body.Data.HowDoYouFeel).to.have.property('PatientUserId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Feeling');
                expect(response.body.Data.HowDoYouFeel).to.have.property('RecordDate');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Comments');

                setTestData(response.body.Data.HowDoYouFeel.id, 'HowDoYouFeelId_1');

                expect(response.body.Data.HowDoYouFeel.PatientUserId).to.equal(getTestData("HowDoYouFeelCreateModel").PatientUserId);
                expect(response.body.Data.HowDoYouFeel.Feeling).to.equal(getTestData("HowDoYouFeelCreateModel").Feeling);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('57:02 -> Get how do you feel record by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.HowDoYouFeel).to.have.property('id');
                expect(response.body.Data.HowDoYouFeel).to.have.property('PatientUserId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('RecordDate');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Comments');

                expect(response.body.Data.HowDoYouFeel.PatientUserId).to.equal(getTestData("HowDoYouFeelCreateModel").PatientUserId);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(200, done);
    });

    it('57:03 -> Search how do you feel records', function(done) {
        loadHowDoYouFeelQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/search${loadHowDoYouFeelQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.HowDoYouFeelRecords).to.have.property('TotalCount');
                expect(response.body.Data.HowDoYouFeelRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.HowDoYouFeelRecords).to.have.property('PageIndex');
                expect(response.body.Data.HowDoYouFeelRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.HowDoYouFeelRecords).to.have.property('Order');
                expect(response.body.Data.HowDoYouFeelRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.HowDoYouFeelRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.HowDoYouFeelRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('57:04 -> Update how do you feel record', function(done) {
        loadHowDoYouFeelUpdateModel();
        const updateModel = getTestData("HowDoYouFeelUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.HowDoYouFeel).to.have.property('id');
                expect(response.body.Data.HowDoYouFeel).to.have.property('PatientUserId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Feeling');
                expect(response.body.Data.HowDoYouFeel).to.have.property('RecordDate');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Comments');

                expect(response.body.Data.HowDoYouFeel.PatientUserId).to.equal(getTestData("HowDoYouFeelUpdateModel").PatientUserId);
                expect(response.body.Data.HowDoYouFeel.Feeling).to.equal(getTestData("HowDoYouFeelUpdateModel").Feeling);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelUpdateModel").Comments);
            })
            .expect(200, done);
    });

    it('57:05 -> Delete how do you feel record', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create how do you feel record again', function(done) {
        loadHowDoYouFeelCreateModel();
        const createModel = getTestData("HowDoYouFeelCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/how-do-you-feel/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HowDoYouFeel.id, 'HowDoYouFeelId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('id');
                expect(response.body.Data.HowDoYouFeel).to.have.property('PatientUserId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Feeling');
                expect(response.body.Data.HowDoYouFeel).to.have.property('RecordDate');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Comments');

                setTestData(response.body.Data.HowDoYouFeel.id, 'HowDoYouFeelId');

                expect(response.body.Data.HowDoYouFeel.PatientUserId).to.equal(getTestData("HowDoYouFeelCreateModel").PatientUserId);
                expect(response.body.Data.HowDoYouFeel.Feeling).to.equal(getTestData("HowDoYouFeelCreateModel").Feeling);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('57:06 -> Negative - Create how do you feel record', function(done) {
        loadNegativeHowDoYouFeelCreateModel();
        const createModel = getTestData("NegativeHowDoYouFeelCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/how-do-you-feel/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('57:07 -> Negative - Get how do you feel record by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('57:08 -> Negative - Update how do you feel record', function(done) {
        loadHowDoYouFeelUpdateModel();
        const updateModel = getTestData("HowDoYouFeelUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorrJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadHowDoYouFeelCreateModel = async (
) => {
    const model = {
        PatientUserId       : getTestData("PatientUserId"),
        Feeling             : faker.number.int(100),
        RecordDate          : faker.date.anytime(),
        Comments            : faker.lorem.words(),
        SymptomAssessmentId : getTestData("AssessmentId")
  
    };
    setTestData(model, "HowDoYouFeelCreateModel");
};

export const loadHowDoYouFeelUpdateModel = async (
) => {
    const model = {
        PatientUserId       : getTestData("PatientUserId"),
        Feeling             : faker.number.int(100),
        RecordDate          : faker.date.anytime(),
        Comments            : faker.lorem.words(),
        SymptomAssessmentId : getTestData("AssessmentId")
    };
    setTestData(model, "HowDoYouFeelUpdateModel");
};

function loadHowDoYouFeelQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeHowDoYouFeelCreateModel = async (
) => {
    const model = {
        Comments: faker.lorem.words(),
    };
    setTestData(model, "NegativeHowDoYouFeelCreateModel");
};
