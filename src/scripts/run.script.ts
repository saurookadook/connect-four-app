import { CommandFactory } from 'nest-commander';

import { ScriptsModule } from './scripts.module';

async function runScript() {
  await CommandFactory.run(ScriptsModule, { logger: ['error', 'warn', 'log'] });
}

void runScript();
