import AbstractMission from './abstractMission.js';
import MissionOne from './mission/missionOne.js';
import MissionThree from './mission/missionThree.js';
import MissionTwo from './mission/missionTwo.js';
import Session from './session.js';

export default class GameFlowMgr {
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

  /** @returns {Session} */
  get_session() {
    return this.#session;
  }

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

  go_to_next_scene() {
    if (this.#state === GameFlowMgr.GAME_STATE.END) {
      this.#session.end_session();
    } else {
      if (this.#state === GameFlowMgr.GAME_STATE.START) {
        this.#session.prepare();
      }

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
        throw new Error('Invalid game state: ' + this.#state);
    }
  }

  // Private methods
  /**
   * @param {number} missionId
   * @returns {AbstractMission}
   */
  #get_mission(missionId) {
    switch (missionId) {
      case 1:
        return new MissionOne(this);
      case 2:
        return new MissionTwo(this);
      case 3:
        return new MissionThree(this);
      default:
        throw new Error('Invalid mission id: ' + missionId);
    }
  }

  /**
   * @param {number} missionId
   */
  #start_pre_mission(missionId) {
    this.#mission = this.#get_mission(missionId);
    this.#session.start_pre_mission(missionId);
  }

  /**
   * @param {number} missionId
   */
  #start_mission(missionId) {
    this.#session.start_mission(missionId);

    setTimeout(() => {
      // If the current mission has not ended, force it to end after 5 minutes.
      if (
        (this.#state === GameFlowMgr.GAME_STATE.MISSION_1 && missionId === 1) ||
        (this.#state === GameFlowMgr.GAME_STATE.MISSION_2 && missionId === 2) ||
        (this.#state === GameFlowMgr.GAME_STATE.MISSION_3 && missionId === 3)
      ) {
        this.go_to_next_scene();
      }
    }, 2 * 60 * 1000 + (missionId == 3 ? 200000000 : 0));
  }

  /**
   * @param {number} missionId
   */
  #start_post_mission(missionId) {
    this.#mission.wrap_up();
    this.#session.start_post_mission(missionId);
  }

  /**
   * @param {number} missionId
   */
  set_mission(missionId) {
    // for debug
    switch (missionId) {
      case 1:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_1;
        break;
      case 2:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_2;
        break;
      case 3:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_3;
        break;
    }
    if (!this.#mission) this.#start_pre_mission(missionId);
  }

  // for debug
  /**
   * @param {number} missionId
   */
  DEBUG_go_to_pre_mission(missionId) {
    switch (missionId) {
      case 1:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_1;
        this.#start_pre_mission(missionId);
        break;
      case 2:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_2;
        this.#start_pre_mission(missionId);
        break;
      case 3:
        this.#state = GameFlowMgr.GAME_STATE.PRE_MISSION_3;
        this.#start_pre_mission(missionId);
        break;
    }
  }
}
