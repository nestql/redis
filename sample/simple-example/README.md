## Description

This example app demonstrates the simplest way to integrate redis to nestjs app.

### Setup and running

> **Prequirements:** This example requires redis to be running on default port

1. Install dependencies:

```shell
$ npm i
```

2. Run app

```shell
$ npm start
```

3. Open http://localhost:3000/api?name=Serge. It will save data to redis, then read from it and send back