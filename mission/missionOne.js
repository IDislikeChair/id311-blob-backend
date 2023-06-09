import { AbstractMission } from '../abstractMission.js';

export class MissionOne extends AbstractMission {
  constructor() {
    super();
  }

  get_duration() {
    return 10000;
  }

  get_result_resolver() {
    const win_condition = (_, o) => o.chosen_number ?? 0 > 10;
    return (m) => this.#mapMap(m, win_condition);
  }

  #mapMap(map, fn) {
    const result = new Map();
    map.forEach((value, key) => {
      const transformedValue = fn(value);
      result.set(key, transformedValue);
    });

    return result;
  }
}
