import HyphaSaleContract from "./hypha";
import { initRPC } from "../utils";

// test("It retrieves the latest round, price and ", async () => {
//   const rpc = initRPC();
//   const hyphaContract = new HyphaSaleContract(rpc);
//   const roundDetails = await hyphaContract.getRoundDetails();

//   expect(roundDetails).toBeTruthy();
// });

// test("It retrieves the hypha balance", async () => {
//   const rpc = initRPC();
//   const hyphaContract = new HyphaSaleContract(rpc);
//   const hyphaBalance = await hyphaContract.getHyphaBalance();

//   console.log("HhyphaBalance", hyphaBalance);
//   expect(hyphaBalance).toBeTruthy();
// });

// test("It retrieves the map of prices per round", async () => {
//   const rpc = initRPC();
//   const hyphaContract = new HyphaSaleContract(rpc);
//   const pricePerRoundMap = await hyphaContract.getPricePerRound();
//   console.log("PRICE PER ROUND MAP : ", pricePerRoundMap);
//   expect(pricePerRoundMap).toBeTruthy();
// });

const priceMap = {
  0: { roundNo: 0, maxSold: 100000, hyphaPerUsd: 1 },
  1: { roundNo: 1, maxSold: 200000, hyphaPerUsd: 1.03 },
  2: { roundNo: 2, maxSold: 300000, hyphaPerUsd: 1.06 },
  3: { roundNo: 3, maxSold: 400000, hyphaPerUsd: 1.09 },
  4: { roundNo: 4, maxSold: 500000, hyphaPerUsd: 1.12 },
  5: { roundNo: 5, maxSold: 600000, hyphaPerUsd: 1.15 },
  6: { roundNo: 6, maxSold: 700000, hyphaPerUsd: 1.18 },
  7: { roundNo: 7, maxSold: 800000, hyphaPerUsd: 1.21 },
  8: { roundNo: 8, maxSold: 900000, hyphaPerUsd: 1.24 },
};

const cases = [
  {
    amount: 100,
    currentRound: 0,
    hyphaRemainingThisRound: 1000,
    priceMap,
    expectedPrice: 100,
  },
  {
    amount: 900000,
    currentRound: 0,
    hyphaRemainingThisRound: 100000,
    priceMap,
    expectedPrice: 1008000,
  },
  {
    amount: 150000,
    currentRound: 0,
    priceMap,
    hyphaRemainingThisRound: 100000,
    expectedPrice: 151500,
  },
  {
    amount: 150000,
    currentRound: 3,
    priceMap,
    hyphaRemainingThisRound: 2,
    expectedPrice: 2 * 1.09 + 100000 * 1.12 + 49998 * 1.15,
  },
];

test.each(cases)(
  "Calculate total cost in USD",
  ({
    amount,
    currentRound,
    hyphaRemainingThisRound,
    priceMap,
    expectedPrice,
  }) => {
    const hyphaContract = new HyphaSaleContract();
    const price = hyphaContract.calculateCost({
      amount,
      currentRound,
      hyphaRemainingThisRound,
      priceMap,
    });

    expect(price).toBe(expectedPrice);
  }
);
