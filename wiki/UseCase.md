# Use Case

## Case 1: I have too many private key wallets, I can't remember them, what should I do?

### Question

I have too many private key wallets, I can't remember them, what should I do?

### Solution

Use hd-wallet to generate a mnemonic, you can put the mnemonic in a safe place, and then you can generate your private key wallet through the mnemonic.

### Example

#### step 1. create a main wallet

```bash
# create
$ node dist/main.js hd-wallet create <password>
```

output:

```bash
### wallet ###
address: 0x64699.....
extendedKey: xprv9s21Zr.....
extendedKeyEncrypt: YFzES.....
mnemonic phrase: butte....
privateKey: 0x175571...
path: m
password: .....
### done ###
```

**Caution:**

Save All the information above to a safe place, you can use it to generate a private key wallet.

**Do not lose it!!!**

#### 2. create a sub wallet from main wallet

Input:

```bash
# create-path
$ node dist/main.js hd-wallet create-path <extendedKeyEncrypt> -p <password> -a <accountIndex> -i <addressIndex>
```

- `<extendedKeyEncrypt>` is the extendedKeyEncrypt of the main wallet (eg: YFzES....)
- `<password>` is the password of the main wallet (eg: 123456)
- `<accountIndex>` is the index of the account (eg: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
- `<addressIndex>` is the index of the address. (eg: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

output:

```bash
create-path wallet...
address: 0x276F7....
privateKey: 0xb8530c....
extendedKey: xprvA2ophBVNW....
extendedKeyEncrypt: lFs/fva32...
path depth: 5
path: m/44'/60'/0'/0/0
done.
```

**Congratulations!!**

you have successfully generated a private key wallet.

Copy the address and privateKey to the wallet, and you can use it to receive and send tokens. Or you can import it into the wallet(eg: Metamask)

You only need to remember AccountIndex and AddressIndex to generate your private key wallet.

Is it very convenient?

## Case 2: Coming soon~
