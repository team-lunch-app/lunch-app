Lunch Application
=================
[![CircleCI](https://circleci.com/gh/team-lunch-app/lunch-app.svg?style=svg)](https://circleci.com/gh/team-lunch-app/lunch-app)

Everyone knows the struggle with *"Where should we go for lunch today?"* We aim to provide a quick and easy fix for that with the *Lunch Application*.

*Lunch Application* is a simple app which provides the user with a randomized lunch restaurant from the Helsinki centrum. Just open up the app, press a button and you'll know where and what to eat today.

Production-ready/Staging version of the application is available at [lunch-application.herokuapp.com](https://lunch-application.herokuapp.com) *(Heroku)*


Table of contents
-----------------
- [Installation](#Installation)
- [Usage](#Usage)
- [Contributing](#Contributing)
- [Credits](#Credits)
- [Licensing](#Licensing)

Installation
------------
### Running locally
For running the development version:
 1. `git clone` the repo
 2. `yarn start`
 3. Browser window should start with address [localhost:3000](http://localhost:3000)

For running the production version locally:
 1. `git clone` the repo
 2. `yarn build`
 3. `node ./server/index.js`

This builds the frontend into a static site and starts the backend server, running on port 3001. By default, when running from the root of the project, the backend is configured to find the static content from `build/`.

To configure the port the server backend listens to, set environment variable `PORT` to desired port.

### Running directly in The Cloud
Ensure that `build/` artifact directory produced by `yarn build` exists and is included in files being pushed and move the files to cloud service of your choosing.

Ensure that `yarn install --production` has been called on the cloud to install the required backend dependencies. Alternatively run `yarn build` directly on the cloud.

After all dependencies are installed and `build/` exists, configure the service to start the server using `node ./server/index.js`.

### Setting up to deploy through CI
General CI configuration is out of scope for this guide. For example *CircleCI* configuration see our default [configuration](.circleci/config.yml).

Additionally, `HEROKU_APP_NAME` and `HEROKU_API_KEY` must be configured on the CI when using the default configuration. The latter can be generated using `heroku auth:token` for developent builds and `heroku authorization:create` for long-term or production tokens.

Usage
-----
`TODO: Short(ish) user guide`

Contributing
------------
See [Running Locally](#Installation) for development setup.

Using TDD for new and updated features is the favored workflow.

`TODO: Link to code style guide etc.`

Credits
-------
`TODO: Names and stuff`

Licensing
---------
`TODO: What license should we use?`

