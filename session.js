import { Client } from './client.js';
import { Emcee } from './emcee.js';
import { GameFlowMgr } from './gameFlowMgr.js';
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

  /**
   * @returns {Emcee}
   */
  get_emcee() {
    return this.#emcee;
  }

  /** @type {PlayerMgr} */
  #player_mgr;

  /**
   * @returns {PlayerMgr}
   */
  get_player_mgr() {
    return this.#player_mgr;
  }

  /** @type {GameFlowMgr} */
  #game_flow_mgr;

  /**
   * @returns {GameFlowMgr}
   */
  get_game_flow_mgr() {
    return this.#game_flow_mgr;
  }

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
  try_register_client_as_emcee(client) {
    this.#emcee = new Emcee(client, this);

    this.#emcee.on('get_session_id', () => {
      this.#emcee.emit('post_session_id', this.#id);
    });

    setInterval(() => {
      this.#emcee.emit('broadcastPlayerStatus', this.#player_mgr.get_status());
    });

    client.emit('success_join_as_emcee');
  }

  /**
   * @param {Client} client
   * @param {string} name
   */
  try_register_client_as_player(client, name) {
    if (!this.#player_mgr.is_name_unused(name)) {
      client.emit('error', 'error_name_taken');
    } else {
      console.log('session.add_client_as_player: adding player...');
      const player = this.#player_mgr.create_new_player(client, name);
      player.emit('success_join_as_player', {
        player_number: player.get_player_number(),
      });
    }
  }

  end_session() {
    this.#emcee.disconnect();
    this.#player_mgr.end_session();
  }

  on_emcee_disconnect() {
    this.end_session();
  }

  /**
   * @param {number} mission_id
   */
  start_pre_mission(mission_id) {
    this.#emcee.emit('start_pre_mission', {
      mission_id,
    });

    this.#game_flow_mgr.set_mission(mission_id);
    this.#player_mgr.start_pre_mission(mission_id);
  }

  /**
   * @param {number} mission_id
   * @param {number} duration
   */
  start_mission(mission_id, duration) {
    this.#emcee.emit('start_mission', {
      mission_id,
      end_timestamp: Date.now() + duration,
    });

    this.#player_mgr.start_mission(mission_id, duration);
  }

  /**
   * @param {number} mission_id
   */
  start_post_mission(mission_id) {
    this.#emcee.emit('start_post_mission', {
      mission_id,
    });

    this.#player_mgr.start_post_mission(mission_id);
  }

  start_end_screen() {
    this.#emcee.emit('start_end_screen');

    this.#player_mgr.start_end_screen();
  }

  on_next() {
    this.#game_flow_mgr.on_next();
  }
}
