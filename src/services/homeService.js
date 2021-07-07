require('dotenv').config();
import request from 'request';
import { BASE_URI, GRAPH_API_VERSION } from '../constants/global';
import Syntaxes from '../constants/syntax';
import common from '../utils/common';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const sendTypingOn = async (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: 'typing_on',
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: `${BASE_URI}${GRAPH_API_VERSION}/me/messages`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log('sendTypingOn sent!');
      } else {
        console.error('Unable to send sendTypingOn: ' + err);
      }
    }
  );
};

const sendMarkSeen = async (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: 'mark_seen',
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: `${BASE_URI}${GRAPH_API_VERSION}/me/messages`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log('sendMarkSeen sent!');
      } else {
        console.error('Unable to send sendMarkSeen: ' + err);
      }
    }
  );
};

const callSendApi = async (sender_psid, response, typingAndSeen) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (typingAndSeen !== false) {
        await sendMarkSeen(sender_psid);
        await sendTypingOn(sender_psid);
      }

      // Construct the message body
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      console.log(request_body);

      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: `${BASE_URI}${GRAPH_API_VERSION}/me/messages`,
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: 'POST',
          json: request_body,
        },
        (err, res, body) => {
          console.log(body);
          if (!err) {
            console.log('Message sent!');
            resolve('Message sent!');
          } else {
            console.error('Unable to send callSendApi: ' + err);
          }
        }
      );
    } catch (e) {
      console.error('Error callSendApi: ' + e);
      reject(e);
    }
  });
};

const handleGetStartedButton = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userName = await getUserName(sender_psid);
      const response = {
        text: `Xin chào ${userName} đã đến với Botm. Gõ "help" để xem danh sách câu lệnh.`,
      };

      await callSendApi(sender_psid, response);

      resolve('Done');
    } catch (e) {
      console.error('Unable to handleGetStartedButton: ' + e);
      reject(e);
    }
  });
};

const handleUnknownMessage = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = {
        text: 'Xin lỗi, tôi chưa hiểu câu lệnh này của bạn! Gõ "help" để xem danh sách câu lệnh.',
      };
      await callSendApi(sender_psid, response);
      resolve('Done');
    } catch (e) {
      console.error('Unable to handleUnknownMessage: ' + e);
      reject(e);
    }
  });
};

const handleHelpMessage = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let menu = 'Danh sách các câu lệnh:';

      Object.entries(Syntaxes).forEach(([key, value]) => {
        menu += `\n\n+ ${value[1]}`;
      });

      const response = getTextTemplate(menu);
      await callSendApi(sender_psid, response);

      resolve('Done');
    } catch (e) {
      console.error('Unable to handleMenuMessage: ' + e);
      reject(e);
    }
  });
};

const getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `${BASE_URI}${sender_psid}?fields=name,first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: 'GET',
      },
      (err, res, body) => {
        if (!err) {
          const response = JSON.parse(body);
          const userName = `${response.name}`;
          resolve(userName);
        } else {
          console.error('Unable to getUserName: ' + err);
          reject(err);
        }
      }
    );
  });
};

const getImageTemplate = (url) => {
  const response = {
    attachment: {
      type: 'image',
      payload: {
        url: url,
        is_reusable: true,
      },
    },
  };

  return response;
};

const getTextTemplate = (text) => {
  const response = {
    text: text,
  };

  return response;
};

const getButtonTemplate = (text, payload) => {
  const titleButton = ['Tiếp tục', 'Thêm lần nữa'];
  const titleButtonIndexRandom = common.randomArrayIndex(0, titleButton.length);

  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons: [
          {
            type: 'postback',
            title: titleButton[titleButtonIndexRandom],
            payload: payload,
          },
        ],
      },
    },
  };
  console.log(response);
  return response;
};

const getQuickReplyTemplate = (payload) => {
  const textQuickReply = ['Bạn có muốn xem tiếp không?', 'Gửi tiếp nha!'];
  const titleButton = ['Tất nhiên rồi', 'OK luôn'];
  const quickReplyIndexRandom = common.randomArrayIndex(0, textQuickReply.length);
  const titleButtonIndexRandom = common.randomArrayIndex(0, titleButton.length);

  const response = {
    text: textQuickReply[quickReplyIndexRandom],
    quick_replies: [
      {
        content_type: 'text',
        title: titleButton[titleButtonIndexRandom],
        payload: payload,
      },
    ],
  };

  return response;
};

module.exports = {
  sendMarkSeen: sendMarkSeen,
  sendTypingOn: sendTypingOn,
  callSendApi: callSendApi,

  handleGetStartedButton: handleGetStartedButton,
  handleHelpMessage: handleHelpMessage,
  handleUnknownMessage: handleUnknownMessage,

  getUserName: getUserName,

  getTextTemplate: getTextTemplate,
  getImageTemplate: getImageTemplate,
  getButtonTemplate: getButtonTemplate,
  getQuickReplyTemplate: getQuickReplyTemplate,
};
