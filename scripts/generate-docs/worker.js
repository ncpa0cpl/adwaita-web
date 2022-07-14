import path from "path";
import workerpool from "workerpool";
import { getComponentTypeDocs } from "./parse-component";

if (!workerpool.isMainThread) {
  workerpool.worker({ getComponentTypeDocs });
}

const pool = workerpool.isMainThread ? workerpool.pool(path.join(__filename)) : null;

export const getPool = () => {
  if (!pool) {
    throw new Error("Pool is not initialized");
  }
  return pool;
};
