import Client from './client.js';

export default class FakeClient extends Client {
  constructor() {
    super('FAKE_SOCKET');
  }

  /**
   * @param {import('./client').IClientOwner} _owner
   */
  setOwner(_owner) {}

  /**
   * @param {any} _event
   * @param {any[]} _args
   */
  emit(_event, ..._args) {}

  /**
   * @param {any} _event
   * @param {any[]} _args
   */
  on(_event, ..._args) {}

  disconnect() {}
}
