# bot-facebook-page
A  chatbot uses Facebook Messenger Platform, building from scratch with Node.js Platform.


### How to setup this bot for your own Facebook Page

- ##### 1. Clone this project
- ##### 2. Create a Heroku app
- ##### 3. Edit SSL_URL in project with <the_domain_your_herokuapp>
- ##### 3. Deploy this project to your Heroku app
- ##### 4. Create a Facebook Developer App, a Facebook Page (to embed this bot)
- ##### 5. Going to Facebook Developer App, add the Messenger Product, generate <PAGE_ACCESS_TOKEN>, config the webhook (default, the url for the webhook is: <the_domain_your_herokuapp>/webhook ) . 
- ##### 6. Remember to update the config variables on Heroku as well.
    - NPM_CONFIG_PRODUCTION = flase
    - PAGE_ACCESS_TOKEN = <PAGE_ACCESS_TOKEN>
    - PORT = 8080
    - VERIFY_TOKEN = anyRandomStringOfBot
- ##### 7. Enjoy!


### More Resources

To learn more about the Messenger Platform, check out these other resources:
- **[📚 Docs Docs Docs](https://developers.facebook.com/docs/messenger-platform/)**: Learn about all the features available for building awesome Messenger bots.
