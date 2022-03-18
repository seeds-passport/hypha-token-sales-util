const HYPHA_SALE_CODE = "buy.hypha";
const HYPHA_SALE_SCOPE = "buy.hypha";

export const TABLES = {
  PRICE: "price",
  SOLD: "sold",
  ROUNDS: "rounds",
  PRICE_HISTORY: "pricehistory",
  PAY_HISTORY: "payhistory",
};

const parseCurrency = (formattedNumber, currencySymbol = "USD") =>
  Number(
    formattedNumber.substring(0, formattedNumber.length - currencySymbol.length)
  );

class HyphaSaleContract {
  constructor(rpc) {
    this.rpc = rpc;
  }

  async getRows({ table, startRow, endRow, limit = 10 }) {
    const { rows, more, nextKey } = await this.rpc.get_table_rows({
      json: true,
      code: HYPHA_SALE_CODE,
      scope: HYPHA_SALE_SCOPE,
      lower_bound: startRow,
      upper_bound: endRow,
      limit,
      table,
    });

    const loadMore =
      more &&
      function () {
        return this.getRows({ table, startRow: nextKey, limit });
      };

    return {
      rows,
      loadMore,
    };
  }

  /**
   * getRoundDetails - returns latest round id, current price of hypha and remaining amount of tokens in this round
   * @return
   * @memberof HyphaTokenSale
   */
  async getRoundDetails() {
    const {
      rows: [roundDetails],
    } = await this.getRows({
      table: TABLES.PRICE,
      limit: 1,
    });

    const currentRound = roundDetails.current_round_id;
    const usdPerHyphaFormatted = roundDetails.hypha_usd;
    const usdPerHypha = parseCurrency(usdPerHyphaFormatted, "USD");
    const hyphaRemainingThisRound = roundDetails.remaining / 100;

    return {
      currentRound,
      usdPerHypha,
      hyphaRemainingThisRound,
    };
  }

  async getPricePerRound() {
    const { rows: rounds } = await this.getRows({
      table: TABLES.ROUNDS,
      limit: 100,
    });
    const roundMap =
      rounds &&
      rounds
        .map(({ id, max_sold, hypha_usd }) => ({
          roundNo: id,
          maxSold: max_sold / 100,
          hyphaPerUsd: parseCurrency(hypha_usd),
        }))
        .reduce(
          (roundMap, round) => ({ ...roundMap, [round.roundNo]: round }),
          {}
        );

    return roundMap;
  }

  async getHyphaBalance() {
    const code = "token.hypha";
    const account = "buy.hypha";
    const currencySymbol = "HYPHA";
    const [balanceFormatted] = await this.rpc.get_currency_balance(
      code,
      account,
      currencySymbol
    );

    const balance =
      balanceFormatted && balanceFormatted.length > currencySymbol.length
        ? balanceFormatted.replace(currencySymbol, "").trim()
        : 0;

    return balance;
  }

  calculateCost({
    amount,
    currentRound,
    hyphaRemainingThisRound,
    priceMap,
    prevCost = 0,
  }) {
    const { hyphaPerUsd, maxSold: maxSoldThisRound } = priceMap[currentRound];
    if (Number(amount) <= Number(hyphaRemainingThisRound))
      return prevCost + Number(amount) * Number(hyphaPerUsd);

    const currentCost = prevCost + hyphaRemainingThisRound * hyphaPerUsd;
    const remainingAmount = amount - hyphaRemainingThisRound;
    const nextRound = Number(currentRound) + 1;
    const { maxSold: maxSoldNextRound } = priceMap[nextRound];

    const hyphaRemainingNextRound = maxSoldNextRound - maxSoldThisRound;

    return this.calculateCost({
      amount: remainingAmount,
      currentRound: nextRound,
      hyphaRemainingThisRound: hyphaRemainingNextRound,
      prevCost: currentCost,
      priceMap,
    });
  }
}

export default HyphaSaleContract;
