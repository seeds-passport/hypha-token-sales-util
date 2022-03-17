import TokenSaleAPI from "./api/tokenSale";
import HyphaSaleContract from "./contract/hypha";
import SeedsContract from "./contract/seeds";
import { initAPI, initRPC } from "./utils/index";
import { API_ENDPOINT, RPC_ENDPOINT } from "./config/index";

class HyphaTokenSale {
  constructor(rpcEndpoint, apiEndpoint) {
    this.init({ rpcEndpoint, apiEndpoint });
    this.convertHyphaToEOS = this.convertHyphaToEOS.bind(this);
    this.convertHyphaToBTC = this.convertHyphaToBTC.bind(this);
  }

  async init({ rpcEndpoint = RPC_ENDPOINT, apiEndpoint = API_ENDPOINT } = {}) {
    const callApi = initAPI(apiEndpoint);
    const rpc = initRPC(rpcEndpoint);

    const hyphaContract = new HyphaSaleContract(rpc);
    const seedsContract = new SeedsContract(rpc);
    const tokenSaleAPI = new TokenSaleAPI(callApi);
    this.hyphaContract = hyphaContract;
    this.seedsContract = seedsContract;
    this.tokenSaleAPI = tokenSaleAPI;

    const roundDetails = await hyphaContract.getRoundDetails();
    const { currentRound, usdPerHypha, hyphaRemainingThisRound } = roundDetails;
    this.roundNo = currentRound;
    this.usdPerHypha = usdPerHypha;
    this.hyphaRemainingThisRound = hyphaRemainingThisRound;
    return roundDetails;
  }

  async selectPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  getAccountDetails = (accountName) =>
    this.seedsContract.getProfile(accountName);

  async convertHyphaToEOS(hypha) {
    if (!this.usdPerHypha) await this.init();

    const usd = Math.round(this.usdPerHypha * hypha, 2);
    const eos = await this.tokenSaleAPI.usdToEos(usd);

    return eos;
  }

  async convertHyphaToBTC(hypha) {
    if (!this.usdPerHypha) await this.init();
    const usd = Math.round(this.usdPerHypha * hypha, 2);
    const btc = await this.tokenSaleAPI.usdToBtc(usd);
    return btc;
  }

  async convertHyphaToUSD(hypha) {
    if (!this.usdPerHypha) await this.init();
    const usd = Math.round(this.usdPerHypha * hypha, 2);
    return usd;
  }

  async getBitcoinAddress(accountName) {
    const { bitcoinAddress } = await this.tokenSaleAPI.findMemberAddress(
      accountName
    );
    return bitcoinAddress;
  }
}

export default HyphaTokenSale;
