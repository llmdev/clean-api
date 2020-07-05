import { AccountModel } from './../../../../domain/models/account'
import { AddAccountModel } from './../../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import mapperId from './../helpers/mapper-id'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = mapperId(result.ops[0])
    return account
  }
}
