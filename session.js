import { Client } from './client';
import { Emcee } from './emcee';
import { Player } from './player';
import { PlayerMgr } from './playerMgr';
import { SessionMgr } from './sessionMgr';

export class Session {
  /** @type {SessionMgr} */
  #session_mgr;

  /** @type {number} */
  #id;

  /** @returns {number} */
  get_session_id() {
    return this.#id;
  }

  /** @type {Emcee} */
  #emcee;

  /** @type {PlayerMgr} */
  #player_mgr;

  /**
   * @param {SessionMgr} session_mgr
   * @param {number} id
   */
  constructor(session_mgr, id) {
    this.#session_mgr = session_mgr;
    this.#id = id;
    this.#player_mgr = new PlayerMgr();
  }

  // Public methods
  /**
   * @param {Client} client
   */
  add_client_as_emcee(client) {
    const emcee = new Emcee(client, this);
    this.#emcee = new Emcee(client, this);
    client.socket.emit('success_join_as_emcee');
  }

  /**
   * @param {Client} client
   * @param {string} name
   */
  add_client_as_player(client, name) {
    if (!this.#player_mgr.is_name_unused(name)) {
      client.socket.emit('error_name_taken');
    } else {
      const player = new Player(client, name, this.#player_mgr);
      this.#player_mgr.add_player(player);
      client.socket.emit('success_join_as_player');
    }
  }

  end_session() {
    this.#emcee.client.socket.emit('end_session');
    this.#player_mgr.emit_to_all_players('end_session');
  }

  on_emcee_disconnect() {
    this.end_session();
  }
}
