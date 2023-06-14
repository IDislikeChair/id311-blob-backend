import FakeClient from './fakeClient';
import Player from './player';
import PlayerMgr from './playerMgr';

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
