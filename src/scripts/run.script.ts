import { CommandFactory } from 'nest-commander';

import { ScriptsModule } from './scripts.module';

async function runScript() {
  await CommandFactory.run(
    ScriptsModule, // force formatting
    { logger: ['error', 'warn', 'log'] },
  );
}

void runScript();
