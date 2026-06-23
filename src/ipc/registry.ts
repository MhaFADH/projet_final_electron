import { toErrorPayload, type IpcResult } from './errors';

export interface ArgsSchema {
  parse(input: unknown): unknown[];
}

export interface Command {
  channel: string;
  schema: ArgsSchema;
  handle(...args: unknown[]): unknown;
}

export interface IpcMainLike {
  handle(
    channel: string,
    listener: (event: unknown, args: unknown[]) => unknown,
  ): void;
}

export const registerCommands = (
  ipcMain: IpcMainLike,
  commands: Command[],
): void => {
  for (const command of commands) {
    ipcMain.handle(
      command.channel,
      async (_event, args): Promise<IpcResult<unknown>> => {
        try {
          const parsed = command.schema.parse(args);
          return { ok: true, value: await command.handle(...parsed) };
        } catch (error) {
          return { ok: false, error: toErrorPayload(error) };
        }
      },
    );
  }
};
