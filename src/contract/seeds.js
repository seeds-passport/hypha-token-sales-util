const SEEDS_ACCOUNTS_CODE = "accts.seeds";
const SEEDS_ACCOUNTS_SCOPE = "accts.seeds";
const TABLES = {
  USERS: "users",
};

function parseTags(tags) {
  return tags ? JSON.parse(tags) : [];
}

class Profile {
  constructor(blockchainProfile) {
    Object.assign(this, blockchainProfile);
    this.skills = parseTags(blockchainProfile.skills);
    this.roles = parseTags(blockchainProfile.roles);
    this.interests = parseTags(blockchainProfile.interests);
  }
}

class SeedsContract {
  constructor(rpc) {
    this.rpc = rpc;
  }

  async getRows({ table, startRow, endRow, limit = 10 }) {
    const { rows, more, nextKey } = await this.rpc.get_table_rows({
      json: true,
      code: SEEDS_ACCOUNTS_CODE,
      scope: SEEDS_ACCOUNTS_SCOPE,
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
   * getProfile - returns profile instance based on account name
   * @param  {string} accountName
   * @return {Profile}
   * @memberof SeedsContract
   */
  async getProfile(accountName) {
    const { rows: [profile] = [] } = await this.getRows({
      startRow: accountName,
      endRow: accountName,
      limit: 1,
      table: TABLES.USERS,
    });

    if (!profile || accountName !== profile.account)
      throw new Error("account-not-found");
    return new Profile(profile);
  }
}

export default SeedsContract;
