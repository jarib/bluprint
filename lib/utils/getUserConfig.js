import fs from 'fs';
import userConfigPath from '../constants/userConfig';
import { version } from '../../package.json';

const defaultUserConfig = {
  version,
  bluprints: {},
};

export default () => {
  if (!fs.existsSync(userConfigPath)) {
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultUserConfig));
  }
  const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));

  // Update version
  if (version !== userConfig.version) {
    userConfig.version = version;
    fs.writeFileSync(userConfigPath, JSON.stringify(userConfig));
  }

  return userConfig;
};
