import TokenSaleAPI from "./api/tokenSale";
import HyphaSaleContract from "./contract/hypha";
import SeedsContract from "./contract/seeds";
import { initAPI, initRPC } from "./utils/index";
import {
  API_ENDPOINT,
  RPC_ENDPOINT,
  EOS_DECIMAL_PLACES,
  BTC_DECIMAL_PLACES,
} from "./config/index";

class HyphaTokenSale {
  constructor(rpcEndpoint = RPC_ENDPOINT, apiEndpoint = API_ENDPOINT) {
    this.init = this.init.bind(this);
    this.init();
    this.rpcEndpoint = rpcEndpoint;
    this.apiEndpoint = apiEndpoint;
    this.convertHyphaToEOS = this.convertHyphaToEOS.bind(this);
    this.convertHyphaToBTC = this.convertHyphaToBTC.bind(this);
  }

  async init() {
    const { rpcEndpoint, apiEndpoint } = this;
    const callApi = initAPI(apiEndpoint);
    const rpc = initRPC(rpcEndpoint);

    const hyphaContract = new HyphaSaleContract(rpc);
    const seedsContract = new SeedsContract(rpc);
    const tokenSaleAPI = new TokenSaleAPI(callApi);
    this.hyphaContract = hyphaContract;
    this.seedsContract = seedsContract;
    this.tokenSaleAPI = tokenSaleAPI;

    const roundDetails = await hyphaContract.getRoundDetails();
    const { roundNo, usdPerHypha, hyphaRemainingThisRound } = roundDetails;
    this.roundNo = roundNo;
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
    let usdPerHypha = this.usdPerHypha;
    if (!usdPerHypha) {
      const roundDetails = await this.init();
      usdPerHypha = roundDetails.usdPerHypha;
    }

    const usd = Math.round(this.usdPerHypha * hypha * 100) / 100;
    const eos = await this.tokenSaleAPI.usdToEos(usd);
    return Number(eos).toFixed(EOS_DECIMAL_PLACES);
  }

  async convertHyphaToBTC(hypha) {
    let usdPerHypha = this.usdPerHypha;
    if (!usdPerHypha) {
      const roundDetails = await this.init();
      usdPerHypha = roundDetails.usdPerHypha;
    }

    const usd = Math.round(this.usdPerHypha * hypha * 100) / 100;
    const btc = await this.tokenSaleAPI.usdToBtc(usd);
    return Number(btc).toFixed(BTC_DECIMAL_PLACES);
  }

  async convertHyphaToUSD(hypha) {
    let usdPerHypha = this.usdPerHypha;
    if (usdPerHypha) await this.init();
    const usd = Math.round(this.usdPerHypha * hypha * 100) / 100;
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
