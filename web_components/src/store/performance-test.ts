import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module
export default class CombinedStore extends VuexModule {
  accounts: Array<any> = [];

  @Mutation
  setRandomArray(randomArray: Array<any>) {
    this.accounts = randomArray;
  }

  // action 'incr' commits mutation 'increment' when done with return value as payload
  @Action({ commit: 'setRandomArray' })
  generateRandomArray() {
    return [];
  }

  get getActiveTransfers(): Array<any> {
    let activeTransfers: Array<any> = [];

    activeTransfers = this.accounts.filter((entry) => {
      return entry.isActive === true;
    });

    activeTransfers.forEach((entry, index) => {
      entry.transfers = entry.transfers.filter((transfer: any) => {
        return transfer.isActive === true;
      });
    });

    return activeTransfers;
  }
}
