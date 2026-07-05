import type { DatabaseAdapter } from "./server-type"

export const databaseAdapter: DatabaseAdapter = {
  isReady() {
    return false
  },
}
