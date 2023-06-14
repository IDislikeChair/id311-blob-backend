import FakeClient from './fakeClient.js';
import Player from './player.js';
import PlayerMgr from './playerMgr.js';

export default class FakePlayer extends Player {
  /**
   * @param {number} playerNumber
   * @param {PlayerMgr} playerMgr
   */
  constructor(playerNumber, playerMgr) {
    super(
      new FakeClient(),
      FakePlayer.#get_random_name() + '🤖',
      playerNumber,
      playerMgr
    );
  }

  /**
   * @returns {string}
   */
  static #get_random_name() {
    const names = [
      'Alan',
      'Bill',
      'Carl',
      'Dave',
      'Emmy',
      'Fran',
      'Guts',
      'Hank',
      'Ivan',
      'Jake',
      'Karl',
      'Liam',
      'Mark',
      'Nick',
      'Owen',
      'Paul',
      'Quin',
      'Rudy',
      'Sean',
      'Troy',
      'Utah',
      'Vern',
      'Wade',
      'Xing',
      'Yuri',
      'Zeus',
    ];
    return names[Math.floor(Math.random() * names.length)];
  }
}
