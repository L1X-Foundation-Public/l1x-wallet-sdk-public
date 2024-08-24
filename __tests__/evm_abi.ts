export default [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct Did.DIDDocument",
        "name": "didDocument",
        "type": "tuple"
      }
    ],
    "name": "DIDCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "did",
        "type": "string"
      }
    ],
    "name": "DIDRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct Did.DIDDocument",
        "name": "didDocument",
        "type": "tuple"
      }
    ],
    "name": "DIDUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "internalType": "struct Did.DIDDocument",
        "name": "didDocument",
        "type": "tuple"
      }
    ],
    "name": "createDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "didDocuments",
    "outputs": [
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "controller",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      }
    ],
    "name": "fetchDID",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "internalType": "struct Did.DIDDocument",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_messageHash",
        "type": "bytes32"
      }
    ],
    "name": "getEthSignedMessageHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "internalType": "struct Did.DIDDocument",
        "name": "didDocument",
        "type": "tuple"
      }
    ],
    "name": "getMessageHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      }
    ],
    "name": "revokeDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string[]",
            "name": "context",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "controller",
            "type": "string"
          }
        ],
        "internalType": "struct Did.DIDDocument",
        "name": "didDocument",
        "type": "tuple"
      }
    ],
    "name": "updateDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
