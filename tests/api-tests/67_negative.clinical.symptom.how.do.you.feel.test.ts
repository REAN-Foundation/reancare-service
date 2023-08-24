import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative How do you feel tests', function() {

    var agent = request.agent(infra._app);

    it('170 - Negative - Create how do you feel record', function(done) {
        loadHowDoYouFeelCreateModel();
        const createModel = getTestData("HowDoYouFeelCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/how-do-you-feel/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('171 - Negative - Get how do you feel record by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeel')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('172 - Negative - Update how do you feel record', function(done) {
        loadHowDoYouFeelUpdateModel();
        const updateModel = getTestData("HowDoYouFeelUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/how-do-you-feel/${getTestData('HowDoYouFeelId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
