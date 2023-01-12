import { Strategy } from './strategy';
import normalizedValue from './util';
import { Context } from '../context';

export default class GradualRolloutSessionIdStrategy extends Strategy {
  constructor() {
    super('gradualRolloutSessionId');
  }

  isEnabled(parameters: any, context: Context) {
    const { sessionId } = context;
    if (!sessionId) {
      return false;
    }

    const percentage = Number(parameters.percentage);
    const groupId = parameters.groupId || '';

    const normalizedId = normalizedValue(sessionId, groupId);

    return percentage > 0 && normalizedId <= percentage;
  }
}
