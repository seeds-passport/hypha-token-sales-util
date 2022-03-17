const HYPHA_SALE_CODE = "buy.hypha";
const HYPHA_SALE_SCOPE = "buy.hypha";

export const TABLES = {
  PRICE: "price",
  SOLD: "sold",
  ROUNDS: "rounds",
  PRICE_HISTORY: "pricehistory",
  PAY_HISTORY: "payhistory",
};

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
    const usdPerHypha = Number(
      usdPerHyphaFormatted.substring(0, usdPerHyphaFormatted.length - 4)
    ).toPrecision(2);
    const hyphaRemainingThisRound = roundDetails.remaining / 100;

    return {
      currentRound,
      usdPerHypha,
      hyphaRemainingThisRound,
    };
  }
}

export default HyphaSaleContract;
