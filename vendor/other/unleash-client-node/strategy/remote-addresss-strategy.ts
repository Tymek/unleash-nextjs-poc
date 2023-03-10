import { Strategy } from './strategy';
import { Context } from '../context';

const ip = require('ip');

export default class RemoteAddressStrategy extends Strategy {
  constructor() {
    super('remoteAddress');
  }

  isEnabled(parameters: any, context: Context) {
    if (!parameters.IPs) {
      return false;
    }
    return parameters.IPs.split(/\s*,\s*/).some((range: string): Boolean => {
      if (range === context.remoteAddress) {
        return true;
      }
      if (!ip.isV6Format(range)) {
        try {
          return ip.cidrSubnet(range).contains(context.remoteAddress);
        } catch (err) {
          return false;
        }
      }
      return false;
    });
  }
}
