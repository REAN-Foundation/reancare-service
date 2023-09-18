import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('44 - File resource management tests', function() {

    var agent = request.agent(infra._app);

    it('44:01 -> upload file', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .field('IsMultiResolutionImage', 'false')
            .field('z', 'c')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect(response => {
                setTestData(response.body.Data.FileResources[0].id, 'FileId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('44:02 -> Upload file as public resource', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .field('IsMultiResolutionImage', 'true')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'FileId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('44:03 -> Upload multi-resolution image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'FileId_2');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('44:04 -> Upload file version', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/upload-version/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .field('name', 'image')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
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

    it('44:05 -> Rename file', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/rename/new_name.png`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('44:06 -> Get resource by id', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('44:07 -> Get versions', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}/versions`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('44:08 -> Negative - upload file', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('44:09 -> Negative - Upload file as public resource', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('44:10 -> Negative - Upload multi-resolution image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .field('Name', 'image')
            .field('IsPublicResource', 'true')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('44:11 -> Negative - Upload file version', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("FileId")}/upload-version/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('44:12 -> Negative - Rename file', function(done) {
        agent
            .post(`/api/v1/file-resources/${getTestData("File")}/rename/new_name.png`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('44:13 -> Negative - Get resource by id', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("FileId")}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('44:14 -> Negative - Get versions', function(done) {
        agent
            .get(`/api/v1/file-resources/${getTestData("File")}/versions`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                ItemId   : faker.string.uuid(),
                ItemType : faker.lorem.word(),
                Keyword  : faker.lorem.words(2)
            }
        ],
        Tags : [
            faker.lorem.words(),
            faker.lorem.words()
        ]
    };
    setTestData(model, "FileUpdateModel");
};

function loadFileQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
