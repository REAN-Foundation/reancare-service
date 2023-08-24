import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('How do you feel tests', function() {

    var agent = request.agent(infra._app);

    it('307 - Create how do you feel record', function(done) {
        loadHowDoYouFeelCreateModel();
        const createModel = getTestData("HowDoYouFeelCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/how-do-you-feel/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.HowDoYouFeel.RecordDate).to.equal(getTestData("HowDoYouFeelCreateModel").RecordDate);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('308 - Get how do you feel record by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.HowDoYouFeel).to.have.property('id');
                expect(response.body.Data.HowDoYouFeel).to.have.property('PatientUserId');
                expect(response.body.Data.HowDoYouFeel).to.have.property('RecordDate');
                expect(response.body.Data.HowDoYouFeel).to.have.property('Comments');

                expect(response.body.Data.HowDoYouFeel.PatientUserId).to.equal(getTestData("HowDoYouFeelCreateModel").PatientUserId);
                expect(response.body.Data.HowDoYouFeel.RecordDate).to.equal(getTestData("HowDoYouFeelCreateModel").RecordDate);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(200, done);
    });

    it('309 - Search how do you feel records', function(done) {
        loadHowDoYouFeelQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/search${loadHowDoYouFeelQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('310 - Update how do you feel record', function(done) {
        loadHowDoYouFeelUpdateModel();
        const updateModel = getTestData("HowDoYouFeelUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.HowDoYouFeel.RecordDate).to.equal(getTestData("HowDoYouFeelUpdateModel").RecordDate);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelUpdateModel").Comments);
            })
            .expect(200, done);
    });

    it('311 - Delete how do you feel record', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.HowDoYouFeel.RecordDate).to.equal(getTestData("HowDoYouFeelCreateModel").RecordDate);
                expect(response.body.Data.HowDoYouFeel.Comments).to.equal(getTestData("HowDoYouFeelCreateModel").Comments);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadHowDoYouFeelCreateModel = async (
) => {
    const model = {
        PatientUserId       : getTestData("PatientUserId"),
        Feeling             : 1,
        RecordDate          : "2023-06-20T00:00:00.000Z",
        Comments            : "abcd66",
        SymptomAssessmentId : getTestData("AssessmentId")
  
    };
    setTestData(model, "HowDoYouFeelCreateModel");
};

export const loadHowDoYouFeelUpdateModel = async (
) => {
    const model = {
        PatientUserId       : getTestData("PatientUserId"),
        Feeling             : 3,
        RecordDate          : "2023-10-20T00:00:00.000Z",
        Comments            : "How do yo feel comments",
        SymptomAssessmentId : getTestData("AssessmentId")
    };
    setTestData(model, "HowDoYouFeelUpdateModel");
};

function loadHowDoYouFeelQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?startDate=2021-06-15';
    return queryString;
}
