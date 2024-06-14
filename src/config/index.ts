import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const configFilePath = join(__dirname, `${process.env.NODE_ENV}.yml`);

  const config = readFileSync(configFilePath, {
    encoding: 'utf-8'
  });

  return yaml.load(config);
};
