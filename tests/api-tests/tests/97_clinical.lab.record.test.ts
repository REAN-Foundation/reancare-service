// import request from 'supertest';
// import { expect } from 'chai';
// import Application from '../../../src/app';
// import { describe, it } from 'mocha';
// import { getTestData, setTestData } from '../init';
// import { faker } from '@faker-js/faker';

// const infra = Application.instance();

// ///////////////////////////////////////////////////////////////////////////

// describe('97 - Lab record tests', function () {
//     var agent = request.agent(infra._app);

//     it('97:01 -> Create lab record', function (done) {
//         loadLabRecordCreateModel();
//         const createModel = getTestData('LabRecordCreateModel');
//         agent
//             .post(`/api/v1/clinical/lab-records/`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(createModel)PatientJwt
//             .expect((response) => {
//                 setTestData(response.body.Data.Notice.id, 'LabRecordId_1');
//                 expect(response.body.Data.Notice).to.have.property('PatientUserId');
//                 expect(response.body.Data.Notice).to.have.property('PrimaryValue');
//                 expect(response.body.Data.Notice).to.have.property('SecondaryValue');
//                 expect(response.body.Data.Notice).to.have.property('TypeName');
//                 expect(response.body.Data.Notice).to.have.property('DisplayName');
//                 expect(response.body.Data.Notice).to.have.property('Unit');
//                 expect(response.body.Data.Notice).to.have.property('ReportId');
//                 expect(response.body.Data.Notice).to.have.property('OrderId');
//                 expect(response.body.Data.Notice).to.have.property('RecordedAt');

//                 setTestData(response.body.Data.Notice.id, 'LabRecordId_1');

//                 expect(response.body.Data.Notice.PatientUserId).to.equal(getTestData('LabRecordCreateModel').PatientUserId);
//                 expect(response.body.Data.Notice.PrimaryValue).to.equal(getTestData('LabRecordCreateModel').PrimaryValue);
//                 expect(response.body.Data.Notice.SecondaryValue).to.equal(
//                     getTestData('LabRecordCreateModel').SecondaryValue
//                 );
//                 expect(response.body.Data.Notice.TypeName).to.equal(getTestData('LabRecordCreateModel').TypeName);
//                 expect(response.body.Data.Notice.DisplayName).to.equal(getTestData('LabRecordCreateModel').DisplayName);
//                 expect(response.body.Data.Notice.Unit).to.equal(getTestData('LabRecordCreateModel').Unit);
//                 expect(response.body.Data.Notice.ReportId).to.equal(getTestData('LabRecordCreateModel').ReportId);
//                 expect(response.body.Data.Notice.OrderId).to.equal(getTestData('LabRecordCreateModel').OrderId);
//                 expect(response.body.Data.Notice.RecordedAt).to.equal(getTestData('LabRecordCreateModel').RecordedAt);
//             })
//             .expect(201, done);
//     });

//     it('97:02 -> Get lab record by id', function (done) {
//         agent
//             .get(`/api/v1/clinical/lab-records/${getTestData('LabRecordId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .expect((response) => {
//                 expect(response.body.Data.Notice).to.have.property('PatientUserId');
//                 expect(response.body.Data.Notice).to.have.property('PrimaryValue');
//                 expect(response.body.Data.Notice).to.have.property('SecondaryValue');
//                 expect(response.body.Data.Notice).to.have.property('TypeName');
//                 expect(response.body.Data.Notice).to.have.property('DisplayName');
//                 expect(response.body.Data.Notice).to.have.property('Unit');
//                 expect(response.body.Data.Notice).to.have.property('ReportId');
//                 expect(response.body.Data.Notice).to.have.property('OrderId');
//                 expect(response.body.Data.Notice).to.have.property('RecordedAt');

//                 expect(response.body.Data.Notice.PatientUserId).to.equal(getTestData('LabRecordCreateModel').PatientUserId);
//                 expect(response.body.Data.Notice.PrimaryValue).to.equal(getTestData('LabRecordCreateModel').PrimaryValue);
//                 expect(response.body.Data.Notice.SecondaryValue).to.equal(
//                     getTestData('LabRecordCreateModel').SecondaryValue
//                 );
//                 expect(response.body.Data.Notice.TypeName).to.equal(getTestData('LabRecordCreateModel').TypeName);
//                 expect(response.body.Data.Notice.DisplayName).to.equal(getTestData('LabRecordCreateModel').DisplayName);
//                 expect(response.body.Data.Notice.Unit).to.equal(getTestData('LabRecordCreateModel').Unit);
//                 expect(response.body.Data.Notice.ReportId).to.equal(getTestData('LabRecordCreateModel').ReportId);
//                 expect(response.body.Data.Notice.OrderId).to.equal(getTestData('LabRecordCreateModel').OrderId);
//                 expect(response.body.Data.Notice.RecordedAt).to.equal(getTestData('LabRecordCreateModel').RecordedAt);
//             })
//             .expect(200, done);
//     });

//     it('97:03 -> Search records', function (done) {
//         loadLabRecordQueryString();
//         agent
//             .get(`/api/v1/clinical/lab-records/search${loadLabRecordQueryString()}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .expect((response) => {
//                 expect(response.body.Data.NoticeRecords).to.have.property('TotalCount');
//                 expect(response.body.Data.NoticeRecords).to.have.property('RetrievedCount');
//                 expect(response.body.Data.NoticeRecords).to.have.property('PageIndex');
//                 expect(response.body.Data.NoticeRecords).to.have.property('ItemsPerPage');
//                 expect(response.body.Data.NoticeRecords).to.have.property('Order');
//                 expect(response.body.Data.NoticeRecords.TotalCount).to.greaterThan(0);
//                 expect(response.body.Data.NoticeRecords.RetrievedCount).to.greaterThan(0);
//                 expect(response.body.Data.NoticeRecords.Items.length).to.greaterThan(0);
//             })
//             .expect(200, done);
//     });

//     it('97:04 -> Update lab record', function (done) {
//         loadLabRecordUpdateModel();
//         const updateModel = getTestData('LabRecordUpdateModel');
//         agent
//             .put(`/api/v1/clinical/lab-records/${getTestData('LabRecordId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(updateModel)
//             .expect((response) => {
//                 expect(response.body.Data.Notice).to.have.property('Title');
//                 expect(response.body.Data.Notice).to.have.property('Description');
//                 expect(response.body.Data.Notice).to.have.property('Link');
//                 expect(response.body.Data.Notice).to.have.property('PostDate');
//                 expect(response.body.Data.Notice).to.have.property('DaysActive');
//                 expect(response.body.Data.Notice).to.have.property('IsActive');
//                 expect(response.body.Data.Notice).to.have.property('ImageUrl');

//                 expect(response.body.Data.Notice.Title).to.equal(getTestData('NoticeUpdateModel').Title);
//                 expect(response.body.Data.Notice.Description).to.equal(getTestData('NoticeUpdateModel').Description);
//                 expect(response.body.Data.Notice.Link).to.equal(getTestData('NoticeUpdateModel').Link);
//                 expect(response.body.Data.Notice.DaysActive).to.equal(getTestData('NoticeUpdateModel').DaysActive);
//                 expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData('NoticeUpdateModel').ImageUrl);
//             })
//             .expect(200, done);
//     });

//     it('97:05 -> Delete lab record', function (done) {
//         agent
//             .delete(`/api/v1/clinical/lab-records/${getTestData('LabRecordId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('success');
//             })
//             .expect(200, done);
//     });

//     it('Create lab record again', function (done) {
//         loadLabRecordCreateModel();
//         const createModel = getTestData('LabRecordCreateModel');
//         agent
//             .post(`/api/v1/clinical/lab-records/`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(createModel)
//             .expect((response) => {
//                 setTestData(response.body.Data.Notice.id, 'LabRecordId');
//                 expect(response.body.Data.Notice).to.have.property('Title');
//                 expect(response.body.Data.Notice).to.have.property('Description');
//                 expect(response.body.Data.Notice).to.have.property('Link');
//                 expect(response.body.Data.Notice).to.have.property('PostDate');
//                 expect(response.body.Data.Notice).to.have.property('DaysActive');
//                 expect(response.body.Data.Notice).to.have.property('IsActive');
//                 expect(response.body.Data.Notice).to.have.property('ImageUrl');
//                 expect(response.body.Data.Notice).to.have.property('Action');

//                 setTestData(response.body.Data.Notice.id, 'LabRecordId');

//                 expect(response.body.Data.Notice.Title).to.equal(getTestData('LabRecordCreateModel').Title);
//                 expect(response.body.Data.Notice.Description).to.equal(getTestData('LabRecordCreateModel').Description);
//                 expect(response.body.Data.Notice.Link).to.equal(getTestData('LabRecordCreateModel').Link);
//                 expect(response.body.Data.Notice.DaysActive).to.equal(getTestData('LabRecordCreateModel').DaysActive);
//                 expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData('LabRecordCreateModel').ImageUrl);
//                 expect(response.body.Data.Notice.Action).to.equal(getTestData('LabRecordCreateModel').Action);
//             })
//             .expect(201, done);
//     });

//     it('97:06 -> Negative - Create lab record', function (done) {
//         loadNegativeLabRecordCreateModel();
//         const createModel = getTestData('NegativeLabRecordCreateModel');
//         agent
//             .post(`/api/v1/clinical/lab-records/`)
//             .set('Content-Type', 'application/json')
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(createModel)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(401, done);
//     });

//     it('97:07 -> Negative - Get lab record by id', function (done) {
//         agent
//             .get(`/api/v1/clinical/lab-records/${getTestData('LabRecordId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(403, done);
//     });

//     it('97:08 -> Negative - Update lab record', function (done) {
//         loadLabRecordUpdateModel();
//         const updateModel = getTestData('LabRecordUpdateModel');
//         agent
//             .put(`/api/v1/clinical/lab-records/${getTestData('LabRecordId')}`)
//             .set('Content-Type', 'application/json')
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(updateModel)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(401, done);
//     });
// });

// ///////////////////////////////////////////////////////////////////////////

// export const loadLabRecordCreateModel = async () => {
//     const model = {
//         PatientUserId: getTestData('PatientUserId'),
//         PrimaryValue: faker.number.float({ fractionDigits: 1 }),
//         SecondaryValue: faker.number.float({ fractionDigits: 1 }),
//         TypeName: faker.lorem.words(),
//         DisplayName: faker.lorem.words(),
//         Unit: faker.lorem.words(),
//         // ReportId: faker.string.uuid(),
//         // OrderId: faker.string.uuid(),
//         RecordedAt: faker.date.past(),
//     };
//     setTestData(model, 'LabRecordCreateModel');
// };

// export const loadLabRecordUpdateModel = async () => {
//     const model = {
//         PatientUserId: getTestData('PatientUserId'),
//         PrimaryValue: faker.number.float({ fractionDigits: 1 }),
//         SecondaryValue: faker.number.float({ fractionDigits: 1 }),
//         TypeName: faker.lorem.words(),
//         DisplayName: faker.lorem.words(),
//         Unit: faker.lorem.words(),
//         ReportId: faker.string.uuid(),
//         OrderId: faker.string.uuid(),
//         RecordedAt: faker.date.past(),
//     };
//     setTestData(model, 'LabRecordUpdateModel');
// };

// function loadLabRecordQueryString() {
//     //This is raw query. Please modify to suit the test
//     const queryString = '';
//     return queryString;
// }

// export const loadNegativeLabRecordCreateModel = async () => {
//     const model = {
//         PostDate: faker.date.anytime(),
//         DaysActive: faker.number.int(100),
//         IsActive: faker.datatype.boolean(),
//         ImageUrl: faker.image.url(),
//     };
//     setTestData(model, 'NegativeLabRecordCreateModel');
// };
