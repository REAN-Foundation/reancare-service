// import request from 'supertest';
// import { expect } from 'chai';
// import Application from '../../../src/app';
// import { describe, it } from 'mocha';
// import { getTestData, setTestData } from '../init';
// import { faker } from '@faker-js/faker';

// const infra = Application.instance();

// ///////////////////////////////////////////////////////////////////////////

// describe('96 - User group tests', function () {
//     var agent = request.agent(infra._app);

//     it('96:01 -> Create user group', function (done) {
//         loadUserGroupCreateModel();
//         const createModel = getTestData('UserGroupCreateModel');
//         agent
//             .post(`/api/v1/user-groups/`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(createModel)
//             .expect((response) => {
//                 setTestData(response.body.Data.UserGroup.id, 'UserGroupId_1');
//                 expect(response.body.Data.UserGroup).to.have.property('Name');
//                 expect(response.body.Data.UserGroup).to.have.property('Description');
//                 expect(response.body.Data.UserGroup).to.have.property('ImageUrl');

//                 setTestData(response.body.Data.UserGroup.id, 'UserGroupId_1');

//                 expect(response.body.Data.UserGroup.Name).to.equal(getTestData('UserGroupCreateModel').Name);
//                 expect(response.body.Data.UserGroup.Description).to.equal(getTestData('UserGroupCreateModel').Description);
//                 expect(response.body.Data.UserGroup.ImageUrl).to.equal(getTestData('UserGroupCreateModel').ImageUrl);
//             })
//             .expect(201, done);
//     });

//     it('96:02 -> Get user group by id', function (done) {
//         agent
//             .get(`/api/v1/user-groups/${getTestData('UserGroupId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .expect((response) => {
//                 expect(response.body.Data.UserGroup).to.have.property('Name');
//                 expect(response.body.Data.UserGroup).to.have.property('Description');
//                 expect(response.body.Data.UserGroup).to.have.property('ImageUrl');

//                 expect(response.body.Data.UserGroup.Name).to.equal(getTestData('UserGroupCreateModel').Name);
//                 expect(response.body.Data.UserGroup.Description).to.equal(getTestData('UserGroupCreateModel').Description);
//                 expect(response.body.Data.UserGroup.ImageUrl).to.equal(getTestData('UserGroupCreateModel').ImageUrl);
//             })
//             .expect(200, done);
//     });

//     it('96:03 -> Search records', function (done) {
//         loadUserGroupQueryString();
//         agent
//             .get(`/api/v1/user-groups/search${loadUserGroupQueryString()}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .expect((response) => {
//                 expect(response.body.Data.UserGroups).to.have.property('TotalCount');
//                 expect(response.body.Data.UserGroups).to.have.property('RetrievedCount');
//                 expect(response.body.Data.UserGroups).to.have.property('PageIndex');
//                 expect(response.body.Data.UserGroups).to.have.property('ItemsPerPage');
//                 expect(response.body.Data.UserGroups).to.have.property('Order');
//                 expect(response.body.Data.UserGroups.TotalCount).to.greaterThan(0);
//                 expect(response.body.Data.UserGroups.RetrievedCount).to.greaterThan(0);
//                 expect(response.body.Data.UserGroups.Items.length).to.greaterThan(0);
//             })
//             .expect(200, done);
//     });

//     it('96:04 -> Update user group', function (done) {
//         loadUserGroupUpdateModel();
//         const updateModel = getTestData('UserGroupUpdateModel');
//         agent
//             .put(`/api/v1/user-groups/${getTestData('UserGroupId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .send(updateModel)
//             .expect((response) => {
//                 expect(response.body.Data.UserGroup).to.have.property('Name');
//                 expect(response.body.Data.UserGroup).to.have.property('Description');
//                 expect(response.body.Data.UserGroup).to.have.property('ImageUrl');

//                 setTestData(response.body.Data.UserGroup.id, 'UserGroupId_1');

//                 expect(response.body.Data.UserGroup.Name).to.equal(getTestData('UserGroupCreateModel').Name);
//                 expect(response.body.Data.UserGroup.Description).to.equal(getTestData('UserGroupCreateModel').Description);
//                 expect(response.body.Data.UserGroup.ImageUrl).to.equal(getTestData('UserGroupCreateModel').ImageUrl);
//             })
//             .expect(200, done);
//     });

//     it('96:05 -> Delete user group', function (done) {
//         agent
//             .delete(`/api/v1/user-groups/${getTestData('UserGroupId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('success');
//             })
//             .expect(200, done);
//     });

//     it('Create user group again', function (done) {
//         loadUserGroupCreateModel();
//         const createModel = getTestData('UserGroupCreateModel');
//         agent
//             .post(`/api/v1/user-groups/`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
//             .send(createModel)
//             .expect((response) => {
//                 setTestData(response.body.Data.UserGroup.id, 'UserGroupId');
//                 expect(response.body.Data.UserGroup).to.have.property('Name');
//                 expect(response.body.Data.UserGroup).to.have.property('Description');
//                 expect(response.body.Data.UserGroup).to.have.property('ImageUrl');

//                 setTestData(response.body.Data.UserGroup.id, 'UserGroupId');

//                 expect(response.body.Data.UserGroup.Name).to.equal(getTestData('UserGroupCreateModel').Name);
//                 expect(response.body.Data.UserGroup.Description).to.equal(getTestData('UserGroupCreateModel').Description);
//                 expect(response.body.Data.UserGroup.ImageUrl).to.equal(getTestData('UserGroupCreateModel').ImageUrl);
//             })
//             .expect(201, done);
//     });

//     it('96:06 -> Negative - Create user group', function (done) {
//         loadNegativeUserGroupCreateModel();
//         const createModel = getTestData('NegativeUserGroupCreateModel');
//         agent
//             .post(`/api/v1/user-groups/`)
//             .set('Content-Type', 'application/json')
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .send(createModel)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(401, done);
//     });

//     it('96:07 -> Negative - Get user group by id', function (done) {
//         agent
//             .get(`/api/v1/user-groups/${getTestData('UserGroupId_1')}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', `${process.env.TEST_API_KEY}`)
//             .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(403, done);
//     });

//     it('96:08 -> Negative - Update user group', function (done) {
//         loadUserGroupUpdateModel();
//         const updateModel = getTestData('UserGroupUpdateModel');
//         agent
//             .put(`/api/v1/user-groups/${getTestData('HospitalId')}`)
//             .set('Content-Type', 'application/json')
//             .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
//             .send(updateModel)
//             .expect((response) => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('failure');
//             })
//             .expect(401, done);
//     });
// });

// ///////////////////////////////////////////////////////////////////////////

// export const loadUserGroupCreateModel = async () => {
//     const model = {
//         Name: faker.person.fullName(),
//         Description: faker.lorem.words(),
//         ImageUrl: faker.image.url(),
//     };
//     setTestData(model, 'UserGroupCreateModel');
// };

// export const loadUserGroupUpdateModel = async () => {
//     const model = {
//         Name: faker.person.fullName(),
//         Description: faker.lorem.words(),
//         ImageUrl: faker.image.url(),
//     };
//     setTestData(model, 'UserGroupUpdateModel');
// };

// function loadUserGroupQueryString() {
//     //This is raw query. Please modify to suit the test
//     const queryString = '';
//     return queryString;
// }

// export const loadNegativeUserGroupCreateModel = async () => {
//     const model = {
//         Name: faker.person.fullName(),
//         Description: faker.lorem.words(),
//         ImageUrl: faker.image.url(),
//     };
//     setTestData(model, 'NegativeUserGroupCreateModel');
// };
