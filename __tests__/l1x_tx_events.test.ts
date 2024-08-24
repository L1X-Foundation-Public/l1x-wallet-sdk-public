import {
  GetTransactionReceiptResponse,
  L1XProvider,
  VMGetTransactionEventsResponse,
} from "../src";

const l1xProvider = new L1XProvider({
  clusterType: "devnet",
  endpoint: "https://v2-devnet-rpc.l1x.foundation",
});

jest.setTimeout(300000);

describe("VM Transaction Events", () => {
  const tx_hash =
    "6c5b0072fa506b6ebfe86106195a87b0944d1efdd8a32975b8c94cde1d627d37";
  let tx_receipt: GetTransactionReceiptResponse;
  let tx_events: VMGetTransactionEventsResponse;

  beforeAll(async () => {
    tx_receipt = await l1xProvider.core.getTransactionReceipt({
      hash: tx_hash,
    });
    console.log({ tx_hash: tx_hash, timestamp: tx_receipt.timestamp });
    tx_events = await l1xProvider.core.getTransactionEvents({
      tx_hash: tx_hash,
      timestamp: tx_receipt.timestamp,
    });
  });

  test("should throw error for invalid tx hash", async () => {
    await expect(
      l1xProvider.core.getTransactionEvents({
        tx_hash: "",
        timestamp: tx_receipt.timestamp,
      })
    ).rejects.toThrow();
  });

  test("should throw error for invalid tx timestamp", async () => {
    const events = await l1xProvider.core.getTransactionEvents({ tx_hash: tx_hash, timestamp: 0 });
    expect(events.events_data).toEqual([]);
  });

  test("should get transaction evnts", () => {
    console.log(tx_events);
  });

  afterAll(() => {
    // console.log({
    //     tx_hash,
    //     tx_events
    // });
  });
});
