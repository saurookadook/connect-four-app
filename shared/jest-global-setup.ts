import { inspect } from 'node:util';

import { sharedLog } from '@connect-four-app/shared';

export default function (globalConfig, projectConfig) {
  const fullW = process.stdout.columns;
  const halfW = Math.floor(fullW / 2);

  console.log('\n');
  console.log(
    ' running Jest global setup... '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
  // console.log({
  //   globalConfig,
  //   projectConfig,
  // });

  global.inspect = inspect;

  sharedLog.setDefaultLevel('DEBUG');

  console.log(
    ' Jest global setup completed! '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
}
