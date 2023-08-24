import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Add journey - Sex, Gender and Identity tests', function() {

    var agent = request.agent(infra._app);

    it('upload learning path', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .field('name', 'image')
            .field('IsPublicResource', 'true')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'LearningPathId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('Add learning path', function(done) {
        loadPathCreateModel();
        const createModel = getTestData("PathCreateModel");
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.LearningPath.id, 'PathId');
                expect(response.body.Data.LearningPath).to.have.property('id');
                expect(response.body.Data.LearningPath).to.have.property('Name');
                expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
                expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
                expect(response.body.Data.LearningPath).to.have.property('Enabled');

                setTestData(response.body.Data.LearningPath.id, 'PathId');

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData("PathCreateModel").Name);
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData("PathCreateModel").ImageUrl);
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(getTestData("PathCreateModel").PreferenceWeight);
                expect(response.body.Data.LearningPath.Enabled).to.equal(getTestData("PathCreateModel").Enabled);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPathCreateModel = async (
) => {
    const model = {
        Name             : "Growing Up",
        ImageUrl         : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        PreferenceWeight : 100,
        Enabled          : true
  
    };
    setTestData(model, "PathCreateModel");
};
