import Payloads from '../constants/payload';
import homeService from '../services/homeService';
import common from '../utils/common';

const handleSendRandomNumber = (sender_psid) => {
  return new Promise(async (resole, reject) => {
    try {
      const number = common.randomIntFromInterval(0, 9999999);
      const content = `Con số may mắn của bạn là: ${number}`;

      const response = homeService.getButtonTemplate(content, Payloads.RANDOM_AGAIN);
      await homeService.callSendApi(sender_psid, response);
      resole('Done');
    } catch (e) {
      console.error('Unable to handleSendRandomNumber: ' + e);
      reject(e);
    }
  });
};

module.exports = {
  handleSendRandomNumber: handleSendRandomNumber,
};
