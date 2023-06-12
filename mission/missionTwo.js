import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

class MissionTwoPair {
  /**
   * @param {number} solverNumber
   * @param {number} guiderNumber
   */
  constructor(solverNumber, guiderNumber) {
    this.solverNumber = solverNumber;
    this.guiderNumber = guiderNumber;
    this.score = 0;
    this.lockState = 50;

    this.answer = -1;
    this.generate_answer();
  }

  generate_answer() {
    // Generate integer from 0 to 4;
    this.answer = Math.floor(Math.random() * 5);
  }
}

export class MissionTwo extends AbstractMission {
  #MOVE_RATE = 1;

  /** @type {number[]} */
  #alivePlayerNumbers;

  /** @type {[MissionTwoPair, MissionTwoPair]} */
  #pairs;

  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);

    // (1) Get the list of alive players from previous missions.
    this.#alivePlayerNumbers = [];
    for (let i = 0; i < 6; i++) {
      if (this.playerMgr.is_player_alive(i)) {
        this.#alivePlayerNumbers.push(i);
      }
    }

    if (this.#alivePlayerNumbers.length !== 4) {
      // throw new Error('missionTwo: ');
    }

    // (2) Pair up players.
    // TODO: Randomize the pairing up process.
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
    this.#broadcastStateToEmcee();

    // (3) Initialize each player's role.
    for (let pair of this.#pairs) {
      this.playerMgr.emit_to_player(pair.solverNumber, 'missionTwoRole', 0);

      this.playerMgr.emit_to_player(pair.guiderNumber, 'missionTwoRole', 1);

      // Set up listener for when solver try answer.
      // If the answer is correct, send signal to guider.
      this.playerMgr.on_player(
        pair.solverNumber,
        'sendAcceleration',
        (xAcceleration) => {
          pair.lockState += xAcceleration * this.#MOVE_RATE;
          if (pair.lockState < 0) pair.lockState = 0;
          if (pair.lockState > 99) pair.lockState = 99;

          if (this.#checkAnswer(pair)) {
            this.playerMgr.emit_to_player(pair.guiderNumber, 'alertAnswer');
          }
        }
      );

      // Set up listener for when solver submit answer.
      // Then, send status to both players.
      // Always generate new answer even if fails.
      this.playerMgr.on_player(
        pair.solverNumber,
        'submitAnswer',
        (/** @type {number} */ answer) => {
          if (this.#checkAnswer(pair)) {
            pair.score++;
            this.#broadcastStateToEmcee();

            // END the game if the score has reached 3
            if (pair.score === 3) this.gameFlowMgr.on_next();
          } else {
            this.#broadcastFailureToEmcee(this.#pairs.indexOf(pair));
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
  #checkAnswer(pair) {
    return Math.floor(pair.lockState / 20) === pair.answer;
  }

  #broadcastStateToEmcee() {
    this.emcee.emit('broadcastState', [
      {
        solverNumber: this.#pairs[0].solverNumber,
        guiderNumber: this.#pairs[0].guiderNumber,
        lockState: this.#pairs[0].lockState,
        score: this.#pairs[0].score,
      },
      {
        solverNumber: this.#pairs[1].solverNumber,
        guiderNumber: this.#pairs[1].guiderNumber,
        lockState: this.#pairs[1].lockState,
        score: this.#pairs[1].score,
      },
    ]);
  }

  /**
   * @param {any} pairNumber
   */
  #broadcastFailureToEmcee(pairNumber) {
    this.emcee.emit('submitAnswerFail', pairNumber);
  }

  wrap_up() {
    const winnerNumbers =
      this.#pairs[0] > this.#pairs[1]
        ? [this.#pairs[0].solverNumber, this.#pairs[0].guiderNumber]
        : [this.#pairs[1].solverNumber, this.#pairs[1].guiderNumber];

    // Set the rest of players dead.
    for (let playerNumber = 0; playerNumber < 6; playerNumber++) {
      if (!(playerNumber in winnerNumbers)) {
        this.playerMgr.set_player_dead(playerNumber);
      }
    }

    console.log(
      `MissionTwo.wrap_up: Winners from this round are ${winnerNumbers}`
    );
  }
}
