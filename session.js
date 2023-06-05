import { Client } from './client.js';
import { Emcee } from './emcee.js';
import { GameFlowMgr } from './gameFlowMgr.js';
import { Player } from './player.js';
import { PlayerMgr } from './playerMgr.js';
import { SessionMgr } from './sessionMgr.js';

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

  /** @type {GameFlowMgr} */
  #game_flow_mgr;

  /**
   * @param {SessionMgr} session_mgr
   * @param {number} id
   */
  constructor(session_mgr, id) {
    this.#session_mgr = session_mgr;
    this.#id = id;
    this.#player_mgr = new PlayerMgr();
    this.#game_flow_mgr = new GameFlowMgr(this);
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
    // TODO: Move this responsibility to Emcee class
    this.#emcee.client.socket.disconnect();
    this.#player_mgr.end_session();
  }

  on_emcee_disconnect() {
    this.end_session();
  }

  /**
   * @param {number} mission_id
   */
  start_pre_mission(mission_id) {
    // TODO: Move this responsibility to Emcee class
    this.#emcee.client.socket.emit('start_pre_mission', {
      mission_id,
    });

    this.#player_mgr.start_pre_mission(mission_id);
  }

  /**
   * @param {number} mission_id
   * @param {number} duration
   */
  start_mission(mission_id, duration) {
    // TODO: Move this responsibility to Emcee class
    this.#emcee.client.socket.emit('start_mission', {
      mission_id,
      end_timestamp: Date.now() + duration,
    });

    this.#player_mgr.start_mission(mission_id, duration);
  }

  /**
   * @param {number} mission_id
   * @param {function(Map<Player, Object>): Map<Player, boolean>} result_resolver
   */
  start_post_mission_and_resolve_results(mission_id, result_resolver) {
    // TODO: Move this responsibility to Emcee class
    this.#emcee.client.socket.emit('start_post_mission', {
      mission_id,
    });

    this.#player_mgr.start_post_mission(mission_id);
    this.#player_mgr.resolve_results(mission_id, result_resolver);
  }

  start_end_screen() {
    // TODO: Move this responsibility to Emcee class
    this.#emcee.client.socket.emit('start_end_screen');

    this.#player_mgr.start_end_screen();
  }

  on_next() {
    this.#game_flow_mgr.on_next();
  }
}
