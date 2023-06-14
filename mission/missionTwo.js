import AbstractMission from '../abstractMission.js';
import GameFlowMgr from '../gameFlowMgr.js';

class MissionTwoPair {
  /**
   * @param {number} solverNumber
   * @param {number} guiderNumber
   */
  constructor(solverNumber, guiderNumber) {
    this.solverNumber = solverNumber;
    this.guiderNumber = guiderNumber;
    this.score = 0;
    this.lifeLeft = 5;
    this.lockState = 50;

    this.answer = -1;
    this.generate_answer();
  }

  generate_answer() {
    // Generate integer from 0 to 4;
    this.answer = Math.floor(Math.random() * 5);
  }
}

export default class MissionTwo extends AbstractMission {
  #MOVE_RATE = 1;

  /** @type {number[]} */
  #alivePlayerNumbers;

  /** @type {MissionTwoPair[]} */
  #pairs;

  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);

    this.#pairs = [];

    // (1) Get the list of alive players from previous missions.
    this.#alivePlayerNumbers = [];
    for (let i = 0; i < 6; i++) {
      if (this.playerMgr.is_player_alive(i)) {
        this.#alivePlayerNumbers.push(i);
      }
    }

    console.log('alivePlayerNumbers', this.#alivePlayerNumbers);

    if (this.#alivePlayerNumbers.length !== 4) {
      // throw new Error('missionTwo: ');
    }

    // (2) Pair up players.
    // TODO: Randomize the pairing up process.
    this.#pairs = [];
    this.#pairs.push(
      new MissionTwoPair(
        this.#alivePlayerNumbers[0],
        this.#alivePlayerNumbers[1]
      )
    );
    this.#pairs.push(
      new MissionTwoPair(
        this.#alivePlayerNumbers[2],
        this.#alivePlayerNumbers[3]
      )
    );

    // (2a) Send the score to TV.
    this.broadcastPairInterval = setInterval(() => {
      this.#broadcast_state_to_emcee();
    }, 100);
    this.emcee.on('gotPairs', () => {
      clearInterval(this.broadcastPairInterval);
    });

    // (3) Initialize each player's role.
    this.broadcastRoleInterval = setInterval(() => {
      for (let pair of this.#pairs) {
        this.playerMgr.emit_to_player(pair.solverNumber, 'missionTwoRole', 0);
        this.playerMgr.emit_to_player(pair.guiderNumber, 'missionTwoRole', 1);

        this.playerMgr.emit_to_player(
          pair.solverNumber,
          'myRolePartner',
          pair.guiderNumber
        );
        this.playerMgr.emit_to_player(
          pair.guiderNumber,
          'myRolePartner',
          pair.solverNumber
        );
      }
    }, 100);

    for (let pair of this.#pairs) {
      // Set up listener for when solver try answer.
      // If the answer is correct, send signal to guider.
      this.playerMgr.on_player(
        pair.solverNumber,
        'sendAcceleration',
        (xAcceleration) => {
          pair.lockState += xAcceleration * this.#MOVE_RATE;
          if (pair.lockState < 0) pair.lockState = 0;
          if (pair.lockState > 99) pair.lockState = 99;

          if (this.#check_answer(pair)) {
            this.playerMgr.emit_to_player(pair.guiderNumber, 'alertAnswer');
          }
          this.#broadcast_state_to_emcee();
        }
      );

      // Set up listener for when solver submit answer.
      // Then, send status to both players.
      // Always generate new answer even if fails.
      this.playerMgr.on_player(
        pair.solverNumber,
        'submitAnswer',
        (/** @type {number} */ answer) => {
          if (this.#check_answer(pair)) {
            pair.score++;
            this.#broadcast_success_to_emcee(this.#pairs.indexOf(pair));
            this.#broadcast_state_to_emcee();

            // END the game if the score has reached 3
            if (pair.score === 3) this.gameFlowMgr.go_to_next_scene();
          } else {
            this.#broadcast_failure_to_emcee(this.#pairs.indexOf(pair));
            pair.lifeLeft -= 1;

            if (pair.lifeLeft <= 0) this.gameFlowMgr.go_to_next_scene();
          }

          this.playerMgr.emit_to_player(
            pair.solverNumber,
            'isAnswerRight',
            pair.answer === answer
          );
          this.playerMgr.emit_to_player(
            pair.guiderNumber,
            'isAnswerRight',
            pair.answer === answer
          );

          pair.generate_answer();
        }
      );
    }
  }

  /**
   * @param {MissionTwoPair} pair
   */
  #check_answer(pair) {
    return Math.floor(pair.lockState / 20) === pair.answer;
  }

  #broadcast_state_to_emcee() {
    this.emcee.emit('broadcastMission2State', [
      {
        solverNumber: this.#pairs[0].solverNumber,
        guiderNumber: this.#pairs[0].guiderNumber,
        lockState: this.#pairs[0].lockState,
        lifeLeft: this.#pairs[0].lifeLeft,
        score: this.#pairs[0].score,
      },
      {
        solverNumber: this.#pairs[1].solverNumber,
        guiderNumber: this.#pairs[1].guiderNumber,
        lockState: this.#pairs[1].lockState,
        lifeLeft: this.#pairs[1].lifeLeft,
        score: this.#pairs[1].score,
      },
    ]);
  }

  /**
   * @param {number} pairNumber
   */
  #broadcast_success_to_emcee(pairNumber) {
    this.emcee.emit('submitAnswerSuccess', pairNumber);
  }

  /**
   * @param {number} pairNumber
   */
  #broadcast_failure_to_emcee(pairNumber) {
    this.emcee.emit('submitAnswerFail', pairNumber);
  }

  wrap_up() {
    clearInterval(this.broadcastRoleInterval);

    let winnerNumbers;

    if (this.#pairs[0].lifeLeft <= 0)
      winnerNumbers = [
        this.#pairs[1].solverNumber,
        this.#pairs[1].guiderNumber,
      ];
    else if (this.#pairs[1].lifeLeft <= 0)
      winnerNumbers = [
        this.#pairs[0].solverNumber,
        this.#pairs[0].guiderNumber,
      ];
    else
      winnerNumbers =
        this.#pairs[0].score > this.#pairs[1].score
          ? [this.#pairs[0].solverNumber, this.#pairs[0].guiderNumber]
          : [this.#pairs[1].solverNumber, this.#pairs[1].guiderNumber];

    // Set the rest of players dead.
    for (let playerNumber = 0; playerNumber < 6; playerNumber++) {
      if (
        !winnerNumbers.includes(playerNumber) &&
        this.playerMgr.is_player_alive(playerNumber)
      ) {
        this.playerMgr.set_player_dead(playerNumber, 2);
      }
    }
  }
}
