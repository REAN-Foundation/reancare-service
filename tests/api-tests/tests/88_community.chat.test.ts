import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('88 - Third user logs in tests', function() {

    var agent = request.agent(infra._app);

    it('88:01 -> Search patient records', function(done) {
        loadPatientQueryString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Patients).to.have.property('TotalCount');
                expect(response.body.Data.Patients).to.have.property('RetrievedCount');
                expect(response.body.Data.Patients).to.have.property('PageIndex');
                expect(response.body.Data.Patients).to.have.property('ItemsPerPage');
                expect(response.body.Data.Patients).to.have.property('Order');
                expect(response.body.Data.Patients.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Patients.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Patients.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('88:02 -> Start conversation', function(done) {
        loadStartConversationModel();
        const createModel = getTestData("StartConversationModel");
        agent
            .post(`/api/v1/chats/conversations/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Conversation.id, "ConversationId");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('88:03 -> First user sends message', function(done) {
        loadFirstUserConversationModel();
        const createModel = getTestData("FirstUserConversationModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId");
                setTestData(response.body.Data.ChatMessage.SenderId, "SenderId");
                expect(response.body.Data.ChatMessage).to.have.property('Message');

                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId");

                expect(response.body.Data.ChatMessage.Message).to.equal(getTestData("FirstUserConversationModel").Message);
                
            })
            .expect(201, done);
    });

    it('88:04 -> Second user sends message', function(done) {
        loadSecondUserConversationModel();
        const createModel = getTestData("SecondUserConversationModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_1");
                setTestData(response.body.Data.ChatMessage.SenderId, "SenderId_1");
                expect(response.body.Data.ChatMessage).to.have.property('Message');

                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_1");

                expect(response.body.Data.ChatMessage.Message).to.equal(getTestData("SecondUserConversationModel").Message);
                
            })
            .expect(201, done);
    });

    it('88:05 -> First user sends message', function(done) {
        loadFirstUserMessageModel();
        const createModel = getTestData("FirstUserMessageModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData("ConversationId")}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_2");
                setTestData(response.body.Data.ChatMessage.SenderId, "SenderId");
                expect(response.body.Data.ChatMessage).to.have.property('Message');

                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_2");

                expect(response.body.Data.ChatMessage.Message).to.equal(getTestData("FirstUserMessageModel").Message);
                
            })
            .expect(201, done);
    });

    it('88:06 -> Second user sends message', function(done) {
        loadSecondUserMessageModel();
        const createModel = getTestData("SecondUserMessageModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData("ConversationId")}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt_2")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_4");
                setTestData(response.body.Data.ChatMessage.SenderId, "SenderId");
                expect(response.body.Data.ChatMessage).to.have.property('Message');

                setTestData(response.body.Data.ChatMessage.id, "ChatMessageId_4");

                expect(response.body.Data.ChatMessage.Message).to.equal(getTestData("SecondUserMessageModel").Message);
                
            })
            .expect(201, done);
    });

    it('88:07 -> Get conversation between these two users - 1', function(done) {

        agent
            .get(`/api/v1/chats/conversations/first-user/${getTestData('PatientUserId')}/second-user/${getTestData('PatientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Conversation).to.have.property('id');
                expect(response.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(response.body.Data.Conversation).to.have.property('Marked');
                expect(response.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(response.body.Data.Conversation).to.have.property('OtherUserId');
    
                expect(response.body.Data.Conversation.InitiatingUserId).to.equal(getTestData("PatientUserId"));
                expect(response.body.Data.Conversation.OtherUserId).to.equal(getTestData("PatientUserId_1"));
                
            })
            .expect(200, done);
    });

    it('88:08 -> Get conversation beween these two users - 2', function(done) {

        agent
            .get(`/api/v1/chats/conversations/first-user/${getTestData('PatientUserId_1')}/second-user/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Conversation).to.have.property('id');
                expect(response.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(response.body.Data.Conversation).to.have.property('Marked');
                expect(response.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(response.body.Data.Conversation).to.have.property('OtherUserId');
  
                expect(response.body.Data.Conversation.InitiatingUserId).to.equal(getTestData("PatientUserId"));
                expect(response.body.Data.Conversation.OtherUserId).to.equal(getTestData("PatientUserId_1"));
              
            })
            .expect(200, done);
    });

    it('88:09 -> Get conversation messages', function(done) {

        agent
            .get(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            
            })
            .expect(200, done);
    });

    it('88:10 -> Get conversation by id', function(done) {

        agent
            .get(`/api/v1/chats/conversations/${getTestData('ConversationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
          
            })
            .expect(200, done);
    });

    it('88:11 -> Get message by id', function(done) {

        agent
            .get(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
        
            })
            .expect(200, done);
    });

    it('88:12 -> Update message by id', function(done) {
        loadMessageUpdateModel();
        const updateModel = getTestData("MessageUpdateModel");
        agent
            .put(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.ChatMessage).to.have.property('id');
                expect(response.body.Data.ChatMessage).to.have.property('Message');
                
                expect(response.body.Data.ChatMessage.Message).to.equal(getTestData("MessageUpdateModel").Message);

            })
            .expect(200, done);
    });

    it('88:13 -> Delete message by id', function(done) {

        agent
            .delete(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
      
            })
            .expect(200, done);
    });

    it('88:14 -> Get recent conversations for first user', function(done) {

        agent
            .get(`/api/v1/chats/users/${getTestData('PatientUserId')}/conversations/recent`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
      
            })
            .expect(200, done);
    });

    it('88:15 -> Get marked/favourite conversations for first user', function(done) {

        agent
            .get(`/api/v1/chats/users/${getTestData('PatientUserId')}/conversations/marked`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
    
            })
            .expect(200, done);
    });

    it('88:16 -> Negative - Search patient records', function(done) {
        loadPatientQueryString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('88:17 -> Negative - Start conversation', function(done) {
        loadNegativeStartConversationModel();
        const createModel = getTestData("NegativeStartConversationModel");
        agent
            .post(`/api/v1/chats/conversations/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('88:18 -> Negative -  First user sends message', function(done) {
        loadFirstUserConversationModel();
        const createModel = getTestData("FirstUserConversationModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('88:19 -> Negative - Second user sends message', function(done) {
        loadSecondUserConversationModel();
        const createModel = getTestData("SecondUserConversationModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('88:20 -> Negative - First user sends message', function(done) {
        loadFirstUserMessageModel();
        const createModel = getTestData("FirstUserMessageModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData("ConversationId")}/messages`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('88:21 -> Negative - Second user sends message', function(done) {
        loadSecondUserMessageModel();
        const createModel = getTestData("SecondUserMessageModel");
        agent
            .post(`/api/v1/chats/conversations/${getTestData("ConversationId")}/messages`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('88:22 -> Negative - Get conversation between these two users - 1', function(done) {

        agent
            .get(`/api/v1/chats/conversations/first-user/${getTestData('PatientUserId')}/second-user/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('88:23 -> Negative - Get conversation messages', function(done) {

        agent
            .get(`/api/v1/chats/conversations/${getTestData('ConversationId')}/messages`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(401, done);
    });

    it('88:24 -> Negative - Get conversation by id', function(done) {

        agent
            .get(`/api/v1/chats/conversations/${getTestData('ConversationId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
          
            })
            .expect(401, done);
    });

    it('88:25 -> Negative - Get message by id', function(done) {

        agent
            .get(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(401, done);
    });

    it('88:26 -> Negative - Update message by id', function(done) {
        loadNegativeMessageUpdateModel();
        const updateModel = getTestData("NegativeMessageUpdateModel");
        agent
            .put(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('88:27 -> Negative - Delete message by id', function(done) {

        agent
            .delete(`/api/v1/chats/messages/${getTestData('ChatMessageId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
      
            })
            .expect(400, done);
    });

    it('88:28 -> Negative - Get recent conversations for first user', function(done) {

        agent
            .get(`/api/v1/chats/users/${getTestData('PatientUserId')}/conversations/recent`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
      
            })
            .expect(401, done);
    });

    it('88:29 -> Negative - Get marked/favourite conversations for first user', function(done) {

        agent
            .get(`/api/v1/chats/users/${getTestData('PatientUserId')}/conversations/marked`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
    
            })
            .expect(401, done);
    });

});

////////////////////////////////////////////////////////////////////////////////

function loadPatientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadStartConversationModel = async (
) => {
    const model = {
        InitiatingUserId : getTestData("PatientUserId"),
        OtherUserId      : getTestData("PatientUserId_1")
    };
    setTestData(model, "StartConversationModel");
};

export const loadFirstUserConversationModel = async (
) => {
    const model = {
        Message : faker.lorem.words()
    };
    setTestData(model, "FirstUserConversationModel");
};

export const loadSecondUserConversationModel = async (
) => {
    const model = {
        Message : faker.lorem.words()
    };
    setTestData(model, "SecondUserConversationModel");
};

export const loadFirstUserMessageModel = async (
) => {
    const model = {
        Message : faker.lorem.words()
    };
    setTestData(model, "FirstUserMessageModel");
};

export const loadSecondUserMessageModel = async (
) => {
    const model = {
        Message : faker.lorem.words()
    };
    setTestData(model, "SecondUserMessageModel");
};

export const loadMessageUpdateModel = async (
) => {
    const model = {
        Message : faker.lorem.words()
    };
    setTestData(model, "MessageUpdateModel");
};

export const loadNegativeStartConversationModel = async (
) => {
    const model = {
        InitiatingUserId : faker.string.uuid(),
    };
    setTestData(model, "NegativeStartConversationModel");
};

export const loadNegativeMessageUpdateModel = async (
) => {
    const model = {
            
    };
    setTestData(model, "NegativeMessageUpdateModel");
};
