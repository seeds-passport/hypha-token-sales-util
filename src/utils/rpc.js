import { JsonRpc } from "eosjs/dist/eosjs-jsonrpc";
import { RPC_ENDPOINT } from "../config/index";

const initRPC = (rpcEndpoint = RPC_ENDPOINT) => {
  return new JsonRpc(rpcEndpoint, { fetch });
};

export default initRPC;
