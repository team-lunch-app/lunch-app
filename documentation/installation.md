Installation
============

This document outlines the basics of what is needed to build and package the sotware and its dependencies for use in production and development environments. The aim of this document is not to be an exhaustive guide in setting up the specific required components. Reader is assumed to possess some knowledge of the tools used.

For details on setting up the development environment, see [Development](./development.md) document.

### Table of contents
 1. [Prequisites](#Prequisites)
 2. [Building the software](#Building-the-software)
 3. [Running the production build](#Running-the-production-build)


Prequisites
-----------
The software runs on very typical *NodeJS* + *ExpressJS* backend. Thus, in order to build or run the software, working `node` installation and the `yarn` package manager are required.

The software also requires access to a *MongoDB* database. Connection happens using database URL, and either local in-memory or cloud-based solutions are viable. Bootstrapper for a local in-memory database **is not provided**. Sample Heroku app uses *MongoDB Atlas*.

Development, building and running have been verified to be working with
 - [`node 13.11.0`](https://nodejs.org/)
 - [`yarn 1.22.4`](https://yarnpkg.com/)
 - [`MongoDB Atlas`](https://www.mongodb.com/cloud/atlas) *(MongoDB 4.2.3)*

Other compatible versions could likely be used, but are not verified to work.

Additionally, for the remainder of this document, it is assumed that you have access to a copy of the source code in this repository, and are able to run the commands listed inside the root directory of the cloned repository *(Unless stated otherwise)*.


Building the software
---------------------
First step is to fetch and install all required dependencies. This can be done by running
```sh
yarn install --production
```
if you are installing in development environment, you may want to drop the `--production` flag.

Then, production version of the frontend with
```sh
yarn build
```
This is an alias of running `build` task inside the `app` package, and you could alternatively run with workspaces directly using
```sh
yarn workspace app build
```
Both of these achieve the same result; the `app` package then contains the built minified frontend in path `packages/app/build/`.


Running the production build
----------------------------
Once built, default configuration should be able to run the backend serer directly from the repository as-is, no further packaging is required. The backend will search for built fronted from the path `packages/app/build`, assuming the backend itself is in its default path `packages/backend`. This requires no further actions unless the directory structure is somehow altered.

Additionally, in order for the backend server to run, there are a few more mandatory steps required.

### Environment variables

For security reasons, there are no hard-coded defaults for security-critical configuration variables. When booting, the server reads environment variables for provided configuration variables and refuses to start if ones required are not provided. Here is a listing of available and required configurations:

| Environment variable | Required | Description |
|----------------------|----------|-------------|
| MONGODB_URI          | yes      | MongoDB connection URI. E.g. something like `mongodb+srv://some-username:passw0rd@some.mongodb-cluster.net/some-database?retryWrites=true&w=majority` |
| SECRET               | yes      | Secret used when generating Json Web Tokens *(used in admin authentication)*. Any randomly generated lengthy string of characters should suffice. |
| GOOGLE_API_KEY       | yes      | Google API key to be used for fetching restaurant information frm Google APIs. The API key should have the Google Places API enabled. |
| PORT                 | no       | The port the server listens to. Defaults to `3001` |
| SALT_ROUNDS          | no       | Number of `bcrypt` salt rounds. Default is `10`, but higher values are stongly encouraged for production use. Generally, higher value means more secure  passwords, but higher computational cost. |
| NODE_ENV             | no       | Tells the app a bit about where it is running. *Should* always be set to `production` when running in production environment, but not strictly necessary. |


### Google API Key
Process of creating an API key has a few steps, but is not complex in no way. For starters, you must have access to a Google Account. The API key will then be tied to that account so use of a personal account outside development environment is strongly discouraged.

For official information on Google API refer to [*Google API Key best practices*](https://developers.google.com/maps/api-key-best-practices).

#### Creating a project and enabling required APIs
In order to generate a key, we first need a *Project* for it. The project is also used to manage which APIs we wish to use. Step-by-step process for creating and configuring a basic project is
 1. Navigate to [dashboard](https://console.developers.google.com/). There, you should be able to set up a *Project* for the API key.
 2. After creating and/or selecting the *Project*, you are greeted with a dashboard view. There, you have a button with big plus sign which reads *"Enable APIs and Services"*.
 3. Now, after clicking the button, you may search for APIs you wish to enable. The software uses only the *Places API*.
 4. Clicking the desired API opens its detailed description and on that page there is a button with label *"Enable"* which can be used to enable the said API for the active project.

#### Generating an API key
Now, with project configured and required APIs enabled, we may now generate a key.
 1. On **dashboard**, navigate to [*Credentials*](https://console.developers.google.com/apis/credentials) section.
 2. There, hit the *"Create credentials"* button and select "API Key"
 3. Congratulations, you now have an API key! Configure the `GOOGLE_API_KEY` environment variable on the system running the backend server to contain the key and we are done.

### Adding the first admin
No default credentials are provided due to [obvious security implications](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password). For adding a first admin user, a utility script is provided instead.

To run the script, use
```sh
MONGODB_URI=YOUR_DB_URI_HERE yarn workspace backend add-user --username=you_username_here --password=your_password_here
```
and substitute the placeholders with your credentials. Note that if you have a `.env` file configured, the script will try to use `MONGODB_URI` from there.


### Running the backend server
Once you've configured all required environment variables and added the first admininstrator, you may try and start the server. This can be done by running *(in project root)*
```bash
NODE_ENV=production node ./packages/backend/src/index.js
```
The `NODE_ENV` environment variable at the start is not strictly required, but is advised for production use, unless you have set it elsewhere.
