import { inspect } from 'node:util';

import { sharedLog } from '@connect-four-app/shared';

sharedLog.setLevel('DEBUG');

const fullW = process.stdout.columns;
const halfW = Math.floor(fullW / 2);

export default function (globalConfig, projectConfig) {
  console.log('\n');
  console.log(
    ' running Jest global setup... '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
  // console.log({
  //   globalConfig,
  //   projectConfig,
  // });

  global.inspect = inspect;

  console.log(
    ' Jest global setup completed! '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
}
