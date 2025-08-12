import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';

import { sharedLog } from '@connect-four-app/shared';
import { buildConnectionURI } from '@/config';
import { BOARD_STATES_TTL_SECONDS } from '@/game-engine/schemas/board-states.schema';

const logger = sharedLog.getLogger('databaseProviders');

async function initSpecialCollections(mongoConn: Connection) {
  const boardStatesCollName = 'board_states';
  const updatedAtFieldName = 'updatedAt';

  let boardStatesCollection: Collection;

  try {
    boardStatesCollection = mongoConn.collection(boardStatesCollName);
  } catch (error) {
    throw new Error(
      `[initSpecialCollections] encountered ERROR: ${error.message}`,
      { cause: error },
    );
  }

  const boardStatesCollectionIndices = await boardStatesCollection.indexes();

  const updatedAtTTLIndex = boardStatesCollectionIndices.find((indexConfig) => {
    return (indexConfig.name || '').indexOf(updatedAtFieldName) >= 0;
  });

  if (
    updatedAtTTLIndex != null &&
    updatedAtTTLIndex.expireAfterSeconds !== BOARD_STATES_TTL_SECONDS
  ) {
    await mongoConn
      .collection(boardStatesCollName)
      .dropIndex(`${updatedAtFieldName}_1`);
    // NOTE: the index will be re-created with the value of
    // BOARD_STATES_TTL_SECONDS by the `Board_State` model
  }
}

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: buildConnectionURI(configService),
      onConnectionCreate: (connection: Connection) => {
        connection.on('open', (...args) => {
          void initSpecialCollections(connection).catch((reason) => {
            logger.log(
              // prettier-ignore
              `${'='.repeat(8)} ERROR in initSpecialCollections `.padEnd(200, '='),
            );
            logger.error(reason);
            logger.log('='.repeat(200));
          });
        });

        return connection;
      },
    }),
    inject: [ConfigService],
  }),
];
