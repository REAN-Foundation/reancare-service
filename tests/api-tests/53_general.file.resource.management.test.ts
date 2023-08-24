import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('File resource management tests', function() {

    var agent = request.agent(infra._app);

    it('205 - upload file', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .field('IsMultiResolutionImage', 'false')
            .field('z', 'c')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResources[0].id, 'FileId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('206 - Upload file as public resource', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .field('IsMultiResolutionImage', 'true')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'FileId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('207 - Upload multi-resolution image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'FileId_2');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    // it('208 - Update file resource - references and tags', function(done) {
    //     loadFileUpdateModel();
    //     const updateModel = getTestData("FileUpdateModel");
    //     agent
    //         .put(`/api/v1/file-resources/${getTestData("FileId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(updateModel)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(201, done);
    // });

    it('209 - Upload file version', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/upload-version/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('name', 'image')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResource.id, 'FileVersionId');
                setTestData(response.body.Data.FileResource.FileName, 'FileName');
                setTestData(response.body.Data.FileResource.Versions, 'FileVersion');
                setTestData(response.body.Data.FileResource.DefaultVersion.OriginalName, 'OriginalName');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('210 - Rename file', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/rename/new_name.png`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('211 - Get resource by id', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    // it('212 - Download by resource id as an attachment', function(done) {
    //     loadFileQueryString();
    //     agent
    //         .get(`/api/v1/file-resources/${getTestData("FileId")}/download${loadFileQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(201, done);
    // });

    // it('213 - Download by version name', function(done) {
    //     loadFileQueryString();
    //     agent
    // eslint-disable-next-line max-len
    //         .get(`/api/v1/file-resources/${getTestData("FileId")}/download-by-version-name/${getTestData("OriginalName")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(201, done);
    // });

    // it('214 - Download by version id', function(done) {
    //     loadFileQueryString();
    //     agent
    //         .get(`/api/v1/file-resources/${getTestData("FileId")}/download-by-version-id/${getTestData("FileVersionId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(201, done);
    // });

    // it('217 - Get version by version id', function(done) {
    //     agent
    //         .get(`/api/v1/file-resources/${getTestData("FileId")}/versions/${getTestData("FileVersionId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(200, done);
    // });

    it('218 - Get versions', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}/versions`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    // it('219 - Delete version by version id', function(done) {
    //     agent
    //         .delete(`/api/v1/file-resources/${getTestData("FileId")}/versions/${getTestData("FileVersionId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(200, done);
    // });

    // it('220 - Delete resource', function(done) {
    //     agent
    //         .delete(`/api/v1/file-resources/${getTestData("FileId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(200, done);
    // });

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

function loadFileQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?';
    return queryString;
}
