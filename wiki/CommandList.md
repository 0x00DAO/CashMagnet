## Command List

### 1. hd-wallet

What is hd-wallet? [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
It is a hierarchical deterministic wallet, which can generate a path.

**hd-wallet** is a tool to create a hd-wallet, and generate a path.

#### 1.1. create

If you want to use hd-wallet, you need to create a wallet first.

```bash
# create
$ node dist/main.js hd-wallet create <password>

```

#### 1.2. create-path

if you want to use hd-wallet generate a path, you need to create a path first.

```bash
# create-path
$ node dist/main.js hd-wallet create-path <extendedKeyEncrypt> -p <password> -a <accountIndex> -i <addressIndex>

```
