import { inspect } from 'node:util';

const fullW = process.stdout.columns;
const halfW = Math.floor(fullW / 2);

export default function (globalConfig, projectConfig) {
  console.log(
    ' running Jest global setup... '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
  // console.log({
  //   globalConfig,
  //   projectConfig,
  // });
  // console.log('?'.repeat(fullW));

  globalThis.inspect = inspect;

  console.log(
    ' Jest global setup completed! '.padStart(halfW, '?').padEnd(fullW, '?'),
  );
}
