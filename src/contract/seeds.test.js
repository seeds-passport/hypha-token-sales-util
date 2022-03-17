import SeedsContract from "./seeds";
import { initRPC } from "../utils";

test("It retrieves the profile for existing account name", async () => {
  const rpc = initRPC();
  const seedsContract = new SeedsContract(rpc);
  const profile = await seedsContract.getProfile("aleksandar11");
  expect(profile).toBeTruthy();
});
