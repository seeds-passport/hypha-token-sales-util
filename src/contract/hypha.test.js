import HyphaSaleContract from "./hypha";
import { initRPC } from "../utils";

test("It retrieves the latest round, price and ", async () => {
  const rpc = initRPC();
  const hyphaContract = new HyphaSaleContract(rpc);
  const roundDetails = await hyphaContract.getRoundDetails();

  expect(roundDetails).toBeTruthy();
});
