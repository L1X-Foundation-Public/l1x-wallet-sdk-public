# L1X Typescript SDK


Utilize this tool to engage with accounts and programs on the L1X Network via the L1X Network JSON RPC API.
## Installation

For use in Node.js or a web application (Invited Members)

- Login via CLI using invited credentials

```bash
npm login
```


For use in Node.js or a web application

```bash
  npm install --save @l1x/l1x-wallet-sdk
```
    
## Documentation and examples

For more detail on individual functions, see the latest [API Documentation](https://github.com/L1X-Foundation/l1x-wallet-sdk/blob/master/docs/index.html)

## Environment Setup

Requirements:

- Node Version >= v16.19.1


To Build from source run

```bash
  npm install
  npm run build
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Usage/Examples


[More Details on L1XProvider](https://dev9378.d3j4qg1i3nb5w3.amplifyapp.com/classes/L1XProvider.html)
```javascript


const {L1XProvider} = require("@l1x/l1x-wallet-sdk")

OR 

For V1 Chain:

import {L1XProvider} from ("@l1x/l1x-wallet-sdk")

function getL1XProvider(){
    return new L1XProvider({
        clusterType:"mainnet"
    })
}

(async() => {
    const l1x = getL1XProvider();
    await l1x.core.getChainState().then(console.log)
})();

For V2 Chain:

import {L1XProvider} from ("@l1x/l1x-wallet-sdk")

function getL1XProvider(){
    return new L1XProvider({
      clusterType:"mainnet",
      endpoint:"https://v2-mainnet-rpc.l1x.foundation"
    })
}

(async() => {
    const l1x = getL1XProvider();
    await l1x.core.getChainState().then(console.log)
})();


```

