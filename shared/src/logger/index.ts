import log from 'loglevel';

type LogLevelNames = keyof typeof log.levels;

type LogLevelsByNumber = {
  [n: number]: LogLevelNames | undefined;
};

const logLevelsByNumber: LogLevelsByNumber = (function () {
  const result = {};

  for (const [levelName, levelValue] of Object.entries(log.levels)) {
    result[levelValue] = levelName;
  }

  return result;
})();

function getLevelName(levelValue: number): LogLevelNames {
  return logLevelsByNumber[levelValue] ?? 'SILENT';
}

const originalFactory = log.methodFactory;

log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  const levelName = getLevelName(logLevel);

  return function (...args) {
    const [message, ...rest] = args;
    rawMethod(
      `[${loggerName.toString()} - ${levelName}] : ${message}`,
      ...rest,
    );
  };
};

log.rebuild();

export { log };
