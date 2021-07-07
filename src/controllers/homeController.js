require('dotenv').config();
import request from 'request';
import { BASE_URI, GRAPH_API_VERSION } from '../constants/global';
import Payloads from '../constants/payload';
import Syntaxes from '../constants/syntax';

import hello from '../features/hello';
import random from '../features/random';
import photo from '../features/photo';

import common from '../utils/common';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) => {
  return res.render('homepage.ejs');
};

let postWebhook = (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
  // Checks if the message contains text
  if (received_message.quick_reply && received_message.quick_reply.payload) {
    const quickReplyPayload = received_message.quick_reply.payload;

    switch (quickReplyPayload) {
      case Payloads.OF_COURSE_IMAGE:
        await photo.handleSendPhoto(sender_psid);
        break;
      default:
        await homeService.handleUnknownMessage(sender_psid);
        break;
    }
  } else if (received_message.text) {
    let text = received_message.text.toLowerCase();
    text = common.filterSpaceTabNewLine(text);
    const textSplit = text.split(' ');

    switch (true) {
      case Syntaxes.HELP[0].includes(textSplit[0]):
        await homeService.handleHelpMessage(sender_psid);
        break;
      case Syntaxes.HELLO[0].includes(textSplit[0]):
        await hello.handleSendHello(sender_psid);
        break;
      case Syntaxes.RANDOM[0].includes(textSplit[0]):
        await random.handleSendRandomNumber(sender_psid);
        break;
      case Syntaxes.PHOTO[0].includes(textSplit[0]):
        await photo.handleSendPhoto(sender_psid);
        break;
      default:
        await homeService.handleUnknownMessage(sender_psid);
        break;
    }
  } else {
    await homeService.handleUnknownMessage(sender_psid);
  }
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  // Get the payload for the postback
  const payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case Payloads.GET_STARTED_PAYLOAD:
      await homeService.handleGetStartedButton(sender_psid);
      break;
    case Payloads.HELP:
      await homeService.handleHelpMessage(sender_psid);
      break;
    case Payloads.RANDOM_AGAIN:
      await random.handleSendRandomNumber(sender_psid);
      break;
    default:
      await homeService.handleUnknownMessage(sender_psid);
      break;
  }
}

// Call profile facebook api with func or can call with postman
let handleSetupProfile = async (req, res) => {
  // Send the HTTP request to the Messenger Platform

  // Construct the message body
  const request_body = {
    get_started: {
      payload: Payloads.GET_STARTED_PAYLOAD,
    },
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'web_url',
            title: 'My facebook',
            url: 'https://www.facebook.com/',
            webview_height_ratio: 'full',
          },
          {
            type: 'postback',
            title: 'Help',
            payload: Payloads.HELP,
          },
        ],
      },
    ],
    whitelisted_domains: [
      'https://basic-chatbot-f-page.herokuapp.com/', //link to your Heroku app
    ],
  };

  return new Promise((resolve, reject) => {
    try {
      request(
        {
          uri: `${BASE_URI}${GRAPH_API_VERSION}/me/messenger_profile`,
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: 'POST',
          json: request_body,
        },
        (err, response, body) => {
          console.log(body);
          if (!err) {
            return res.send('Setup user profile success');
          } else {
            return res.send('Something wrongs with setup, please check logs...: ' + err);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getHomePage: getHomePage,
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  handleSetupProfile: handleSetupProfile,
};
