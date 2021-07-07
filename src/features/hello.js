import homeService from '../services/homeService';

const handleSendHello = async (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userName = await homeService.getUserName(sender_psid);
      const content = `Hello ${userName}.`;

      const response = homeService.getTextTemplate(content);
      await homeService.callSendApi(sender_psid, response);

      resolve('Done');
    } catch (e) {
      console.error('Unable to handleSendHello: ' + e);
      reject(e);
    }
  });
};

module.exports = {
  handleSendHello: handleSendHello,
};
