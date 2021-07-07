import homeService from '../services/homeService';

const handleSendPhoto = async (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = 'https://picsum.photos/500/500';

      const response = homeService.getImageTemplate(url);
      await homeService.callSendApi(sender_psid, response);

      const responseQuickReply = homeService.getQuickReplyTemplate(payload);
      await homeService.callSendApi(sender_psid, responseQuickReply);

      resolve('Done');
    } catch (e) {
      console.error('Unable to handleSendPhoto: ' + e);
      reject(e);
    }
  });
};

module.exports = {
  handleSendPhoto: handleSendPhoto,
};
