import { AbstractMission } from './abstractMission.js';
import { MissionOne } from './mission/missionOne.js';
import { MissionThree } from './mission/missionThree.js';
import { MissionTwo } from './mission/missionTwo.js';
import { Session } from './session.js';

export class GameFlowMgr {
  static AFTER_MISSION_DELAY = 2000;

  static GAME_STATE = {
    START: 0,
    PRE_MISSION_1: 1,
    MISSION_1: 2,
    POST_MISSION_1: 3,
    PRE_MISSION_2: 4,
    MISSION_2: 5,
    POST_MISSION_2: 6,
    PRE_MISSION_3: 7,
    MISSION_3: 8,
    POST_MISSION_3: 9,
    END: 10,
  };

  /** @type {Session} */
  #session;

  /** @type {number} */
  #state;

  /** @type {AbstractMission} */
  #mission;

  /**
   * @param {Session} session
   */
  constructor(session) {
    this.#session = session;
    this.#state = GameFlowMgr.GAME_STATE.START;
  }

  on_next() {
    if (this.#state == GameFlowMgr.GAME_STATE.END) {
      this.#session.end_session();
    } else {
      this.#state++;
    }

    switch (this.#state) {
      case GameFlowMgr.GAME_STATE.PRE_MISSION_1:
        this.#start_pre_mission(1);
        break;
      case GameFlowMgr.GAME_STATE.MISSION_1:
        this.#start_mission(1);
        break;
      case GameFlowMgr.GAME_STATE.POST_MISSION_1:
        this.#start_post_mission(1);
        break;
      case GameFlowMgr.GAME_STATE.PRE_MISSION_2:
        this.#start_pre_mission(2);
        break;
      case GameFlowMgr.GAME_STATE.MISSION_2:
        this.#start_mission(2);
        break;
      case GameFlowMgr.GAME_STATE.POST_MISSION_2:
        this.#start_post_mission(2);
        break;
      case GameFlowMgr.GAME_STATE.PRE_MISSION_3:
        this.#start_pre_mission(3);
        break;
      case GameFlowMgr.GAME_STATE.MISSION_3:
        this.#start_mission(3);
        break;
      case GameFlowMgr.GAME_STATE.POST_MISSION_3:
        this.#start_post_mission(3);
        break;
      case GameFlowMgr.GAME_STATE.END:
        this.#session.start_end_screen();
        break;
      default:
        throw new Error('Invalid game state: ' + 'this.#state');
    }
  }

  // Private methods
  /**
   * @param {number} mission_id
   * @returns {AbstractMission}
   */
  #get_mission(mission_id) {
    switch (mission_id) {
      case 1:
        return new MissionOne(
          this.#session.get_emcee(),
          this.#session.get_player_mgr()
        );
      case 2:
        return new MissionTwo(
          this.#session.get_emcee(),
          this.#session.get_player_mgr()
        );
      case 3:
        return new MissionThree(
          this.#session.get_emcee(),
          this.#session.get_player_mgr()
        );
      default:
        throw new Error('Invalid mission id: ' + mission_id);
    }
  }

  /**
   * @param {number} mission_id
   */
  #start_pre_mission(mission_id) {
    this.#mission = this.#get_mission(mission_id);
    this.#session.start_pre_mission(mission_id);
  }

  /**
   * @param {number} mission_id
   */
  #start_mission(mission_id) {
    const duration = this.#mission.get_duration();
    this.#session.start_mission(mission_id, duration);

    setTimeout(this.on_next, duration + GameFlowMgr.AFTER_MISSION_DELAY);
  }

  /**
   * @param {number} mission_id
   */
  #start_post_mission(mission_id) {
    this.#get_mission(mission_id).run();
    this.#session.start_post_mission(mission_id);
  }

  // for debug
  DEBUG_go_to_pre_mission(mission_id) {
    switch (mission_id) {
      case 1:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_1;
        this.#start_pre_mission(mission_id);
        break;
      case 2:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_2;
        this.#start_pre_mission(mission_id);
        break;
      case 3:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_3;
        this.#start_pre_mission(mission_id);
        break;
    }
  }
}
