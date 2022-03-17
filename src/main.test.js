import HyphaTokenSale from "./main";

test("It gets current round details", async () => {
  const hyphaTokenSale = new HyphaTokenSale();
  const roundDetails = await hyphaTokenSale.init();

  expect(roundDetails).toBeTruthy();
});

test("It retrieves members bitcoin account", async () => {
  const hyphaTokenSale = new HyphaTokenSale();
  await hyphaTokenSale.init();

  const account = await hyphaTokenSale.getBitcoinAddress("aleksandardj");
  expect(account).toBeTruthy();
});
