import { Command, CommandRunner } from 'nest-commander';

import { sharedLog } from '@connect-four-app/shared';

const logger = sharedLog.getLogger('TestCommand');

@Command({
  name: 'test_script',
  description: 'Test command for scripts',
})
export class TestCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(): Promise<void> {
    logger.debug('Executing test command...');

    await new Promise((resolve) => {
      const between1And3Milliseconds = Math.floor(Math.random() * 3 * 1000);
      setTimeout(() => {
        logger.debug(
          `---- Resolved after ${between1And3Milliseconds} milliseconds`,
        );
        resolve(between1And3Milliseconds);
      }, between1And3Milliseconds);
    });

    logger.debug('Test command completed successfully!');
    process.exitCode = 0;
  }
}
