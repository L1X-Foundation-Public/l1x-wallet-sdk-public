import { L1XProvider } from "../src";
import fs from "fs/promises";

jest.setTimeout(300000);

let l1xProvider = new L1XProvider({
  clusterType: "devnet",
  endpoint: "https://v2-devnet-rpc.l1x.foundation",
});

let private_key =
  "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32";

describe("L1X > VM > Deploy", () => {
  test("Happy flow", async () => {
    let _response = await l1xProvider.vm.deploy({
      attrib: {
        base_contract_bytes: await fs.readFile("./__tests__/l1x_ft.o"),
        access_type: "PUBLIC",
      },
      private_key: private_key,
      fee_limit: 1000000000,
    });
    console.log("🚀 ~ test ~ _response:", _response);
    expect(_response).toEqual(
      expect.objectContaining({
        contract_address: expect.any(String),
        hash: expect.any(String),
      })
    );
  });
});
