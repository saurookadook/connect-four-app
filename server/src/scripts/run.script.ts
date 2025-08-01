import { CommandFactory } from 'nest-commander';

import { sharedLog } from '@connect-four-app/shared';
import { ScriptsModule } from './scripts.module';

sharedLog.setDefaultLevel('DEBUG');
sharedLog.setLevel('DEBUG');

async function runScript() {
  await CommandFactory.run(
    ScriptsModule, // force formatting
    // TODO: figure out why logging isn't working as expected with shared logger
    { logger: ['error', 'warn', 'log', 'debug'] },
  );
}

void runScript();
