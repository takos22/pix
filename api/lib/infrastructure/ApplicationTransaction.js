import { knex } from '../../db/knex-database-connection.js';
import { asyncLocalStorage } from './utils/async-local-storage.js';
import { DomainTransaction } from './DomainTransaction.js';

class ApplicationTransaction {
  constructor(transaction) {
    this.transaction = transaction;
  }

  static getConnection({ domainTransaction = DomainTransaction.emptyTransaction() } = {}) {
    const store = asyncLocalStorage.getStore();

    if (domainTransaction.knexTransaction) {
      return domainTransaction.knexTransaction;
    } else if (store?.transaction) {
      return store.transaction;
    }
    return knex;
  }

  static async execute(func) {
    const trx = await knex.transaction();
    let result;

    try {
      result = await asyncLocalStorage.run({ transaction: trx }, func);
    } catch (e) {
      await trx.rollback();
      throw e;
    }

    await trx.commit();
    return result;
  }
}

export { ApplicationTransaction };
