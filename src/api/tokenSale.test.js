import TokenSaleAPI from "./tokenSale";
import { initAPI } from "../utils";
import { API_ENDPOINT } from "../config";

test("It retrieves the BTC address for existing account name", async () => {
  const callApi = initAPI(API_ENDPOINT);
  const tokenSaleApi = new TokenSaleAPI(callApi);
  const account = await tokenSaleApi.findMemberAddress("aleksandardj");
  expect(account).toBeTruthy();
});
