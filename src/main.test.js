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

test("It returns 4 digits for eos", async () => {
  const hyphaTokenSale = new HyphaTokenSale();
  const eos = await hyphaTokenSale.convertHyphaToEOS(0.5);
  expect(eos).toBeTruthy();
});

test("It returns 8 digits for btc", async () => {
  const hyphaTokenSale = new HyphaTokenSale();
  const btc = await hyphaTokenSale.convertHyphaToBTC(0.5);
  expect(btc).toBeTruthy();
});
