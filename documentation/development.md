Setting up development environment
==================================

This document outlines basics required for setting up a development environment for the software. The prequisites in [Installation](./installation.md#Prequisites) document apply here, too.

### Table of contents
 1. [Setting up](#Setting-up)
 2. [Running locally](#Running-locally)
 3. [Running tests](#Running-tests)


Setting up
----------
First of all, if you have not run it yet, execute `yarn install`.

Running backend in development has the very same prequisites as running in production. That is, you need to provide it with valid `SECRET`, `GOOGLE_API_KEY` and `MONGODB_URI` environment variables. However, to make this a bit easier, the project allows use of `.env` files for configuring the variables in the development environment.

Add a file with name `.env` to the `packages/backend/` directory and provide the required environment variables there. On information on valid values for those variables, refer to respective section on the [Installation](./installation#Running-the-production-build) document.

With that done, everything should be ready.


Running locally
---------------
For running a local development version of the application, one needs to run the backend and the frontend separately. In order to start the backend, use
```sh
yarn start:back
```
and then in separate terminal, run the frontend using
```sh
yarn start
```

Alternatively you could run the `start` tasks directly in their respective workspaces using
```sh
yarn workspace backend start     # start the backend
yarn workspace app start         # start the frontend
```

Once started, frontend and backend will run in *watch mode*, automatically refreshing on changes.


Running tests
---------------
Tests for the frontend can be run using
```sh
yarn test
```

Respectively, for the backend tests, use
```sh
yarn test:back
```

These two are aliases for running the `test` yarn script in workspaces. That is, you could alternatively run
```sh
yarn workspace app test         # frontend tests
yarn workspace backend test     # backend tests
```

By default, the tests are configured to run with `--watch` flag, causing them to be automatically re-run on changes to related code.
