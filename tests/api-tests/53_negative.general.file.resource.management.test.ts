import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative File resource management tests', function() {

    var agent = request.agent(infra._app);

    it('116 - Negative - upload file', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('117 - Negative - Upload file as public resource', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .field('IsMultiResolutionImage', 'true')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('118 - Negative - Upload multi-resolution image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('119 - Negative - Upload file version', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/upload-version/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('120 - Negative - Rename file', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("File")}/rename/new_name.png`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('121 - Negative - Get resource by id', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB900V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('122 - Negative - Get versions', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("File")}/versions`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadFileUpdateModel = async (
) => {
    const model = {
        References : [
            {
                ItemId   : "56",
                ItemType : "Biometrics",
                Keyword  : "Blood pressure"
            }
        ],
        Tags : [
            "First tag",
            "Second tag"
        ]
    };
    setTestData(model, "FileUpdateModel");
};

