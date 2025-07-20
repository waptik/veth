import * as stdLog from "@std/log";
import { ConsoleHandlerOptions } from "@std/log";

type Bindings = Record<string, unknown>;

const state = {
  bindings: new Map<string, Bindings>(),
};

export class VethLoggerHandler extends stdLog.ConsoleHandler {
  readonly bindings: Record<string, unknown>;
  constructor(
    level: stdLog.LevelName,
    options?: ConsoleHandlerOptions,
    bindings: Record<string, unknown> = {},
  ) {
    super(level, options);
    this.bindings = bindings;
  }
}

stdLog.setup({
  handlers: {
    default: new VethLoggerHandler("DEBUG", {
      formatter: ({ datetime, levelName, msg, args }) => {
        let line = `[VETH] |  ${datetime.toUTCString()} | ${levelName} | ${msg}`;

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

export function createLogger(
  name: string,
  bindings: Record<string, unknown> = {},
  isChild = false,
) {
  const existingLoggerBindings = isChild ? state.bindings.get(name) : null;
  const mergedBindings = {
    ...(existingLoggerBindings ?? {}),
    ...bindings,
  };
  stdLog.setup({
    handlers: {
      default: new VethLoggerHandler(
        "INFO",
        {
          formatter: ({ datetime, levelName, msg, args }) => {
            // bindings to array
            const bindingsArray = Object.entries(mergedBindings)
              .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
              .join("; ");
            let line = `${levelName} | ["VETH.${name}"] @ ${datetime.toUTCString()} | [${bindingsArray}] | ${msg}`;

            if (args.length > 0) {
              const flatArgs = args.length === 1 ? args[0] : args;
              line += "\n" + JSON.stringify(flatArgs, undefined, 2);
            }

            return line;
          },
        },
        bindings,
      ),
    },
    loggers: {
      [name]: {
        level: "INFO",
        handlers: ["default"],
      },
    },
  });
  return stdLog.getLogger(name);
}

export const logger = stdLog;
