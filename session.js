import { Client } from './client.js';
import { Emcee } from './emcee.js';
import { GameFlowMgr } from './gameFlowMgr.js';
import { PlayerMgr } from './playerMgr.js';

export class Session {
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
  #playerMgr;

  /**
   * @returns {PlayerMgr}
   */
  get_player_mgr() {
    return this.#playerMgr;
  }

  /** @type {GameFlowMgr} */
  #gameFlowMgr;

  /**
   * @returns {GameFlowMgr}
   */
  get_game_flow_mgr() {
    return this.#gameFlowMgr;
  }

  /**
   * @param {number} id
   */
  constructor(id) {
    this.#id = id;
    this.#playerMgr = new PlayerMgr();
    this.#gameFlowMgr = new GameFlowMgr(this);
  }

  // Public methods
  /**
   * @param {Client} client
   */
  register_client_as_emcee(client) {
    this.#emcee = new Emcee(client, this);

    this.#emcee.on('get_session_id', () => {
      this.#emcee.emit('post_session_id', this.#id);
    });

    setInterval(() => {
      this.#emcee.emit('broadcastPlayerStatus', this.#playerMgr.get_status());
    });

    client.emit('success_join_as_emcee');
  }

  /**
   * @param {Client} client
   * @param {string} name
   */
  try_register_client_as_player(client, name) {
    if (!this.#playerMgr.is_name_unused(name)) {
      client.emit('error', 'error_name_taken');
    } else {
      const player = this.#playerMgr.create_new_player(client, name);
      player.emit('success_join_as_player', {
        player_number: player.get_number(),
      });

      setInterval(() => {
        player.emit('broadcastPlayerStatus', this.#playerMgr.get_status());
      });
    }
  }

  end_session() {
    this.#emcee.disconnect();
    this.#playerMgr.end_session();
  }

  on_emcee_disconnect() {
    this.end_session();
  }

  prepare() {
    this.#playerMgr.fill_with_fake_players_until_six_players();
  }

  /**
   * @param {number} missionId
   */
  start_pre_mission(missionId) {
    this.#emcee.emit('start_pre_mission', { missionId });

    this.#gameFlowMgr.set_mission(missionId);
    this.#playerMgr.start_pre_mission(missionId);
  }

  /**
   * @param {number} missionId
   */
  start_mission(missionId) {
    this.#emcee.emit('start_mission', { missionId });

    this.#playerMgr.start_mission(missionId);
  }

  /**
   * @param {number} missionId
   */
  start_post_mission(missionId) {
    this.#emcee.emit('start_post_mission', { missionId });

    this.#playerMgr.start_post_mission(missionId);
  }

  start_end_screen() {
    this.#emcee.emit('start_end_screen');

    this.#playerMgr.start_end_screen();
  }

  on_next() {
    this.#gameFlowMgr.on_next();
  }
}
