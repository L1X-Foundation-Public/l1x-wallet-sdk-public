import { L1XProvider } from "../src";

const l1xProvider = new L1XProvider({
  clusterType: "testnet",
  endpoint: "https://testnet-prerelease-rpc.l1x.foundation",
});

describe("Transaction receipt", () => {
  const hash = "0x5c98dc8f70a1bacbee85dab97058ee0fe350e8665815f500326495835d3d52ff";
  let receipt: any;

  test("should fetch transaction receipt", async () => {
    receipt = await l1xProvider.core.getTransactionReceipt({ hash });
  });

  afterAll(() => {
    console.log('After all', {
        receipt,
        hash
    });
  });
});
