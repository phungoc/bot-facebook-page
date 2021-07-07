import express from 'express';
import homeController from '../controllers/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/', homeController.getHomePage);

  router.post('/setup-profile', homeController.handleSetupProfile); //set up the persistent menu & get started button

  router.post('/webhook', homeController.postWebhook);
  router.get('/webhook', homeController.getWebhook);
  return app.use('/', router);
};

module.exports = initWebRoutes;
