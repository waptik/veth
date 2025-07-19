import * as logger from "@std/log";

logger.setup({
  handlers: {
    default: new logger.ConsoleHandler("DEBUG", {
      formatter: ({ datetime, levelName, msg, args }) => {
        let line = `${datetime.toUTCString()} | ${levelName} | ${msg}`;

        if (args.length > 0) {
          const flatArgs = args.length === 1 ? args[0] : args;
          line += "\n" + JSON.stringify(flatArgs, undefined, 2);
        }

        return line;
      },
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["default"],
    },
  },
});

export { logger };
