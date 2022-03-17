const SATOSHI_PER_BTC = 100000000;
const CENTS_PER_USD = 100;

class TokenSale {
  constructor(callApi) {
    this.callApi = callApi.bind(this);
  }

  async findMemberAddress(accountName) {
    const endpoint = `findMemberAddress/${accountName}`;
    const address = this.callApi(endpoint);
    return address;
  }

  async usdToBtc(usd) {
    const cents = usd * CENTS_PER_USD;
    const endpoint = `centsToSatoshi/${cents}`;

    const { satoshiAmount } = await this.callApi(endpoint);
    const btc = satoshiAmount / SATOSHI_PER_BTC;
    return btc;
  }

  async usdToEos(usd) {
    const endpoint = `usdToEos/${usd}`;
    const response = await this.callApi(endpoint);
    const { eosValue } = response;
    return eosValue;
  }
}

export default TokenSale;
