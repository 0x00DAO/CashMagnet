# CashMagnet - A NodeJS CLI

## Description

CashMagnet is a NodeJS CLI that allows you to run commands on your local machine.

it can help you earn money by running commands on your local machine.

## Installation (Terminal)

```bash
# install
$ git clone git@github.com:0x00DAO/CashMagnet.git && cd CashMagnet
$ npm install && npm run build
```

## Upgrade (Terminal)

```bash
# upgrade
$ git pull && npm install && npm run build
```

## Running the app example

```bash
# example 1
$ node dist/main.js help

```

## Test

```bash
# test
$ npx ts-node src/main.js my-exec 'echo Hello World!'

```

## Command List

### 1. hd-wallet

#### 1.1. create

```bash
# create
$ node dist/main.js hd-wallet create <password>

```

#### 1.2. create-path

```bash
# create-path
$ node dist/main.js hd-wallet create-path <extendedKeyEncrypt> -p <password> -a <accountIndex> -i <addressIndex>

```

## RoadMap

Link: [RoadMap](RoadMap.md)

## License

Nest is [MIT licensed](LICENSE).
