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
    ipcMain.handle(command.channel, (_event, args) => {
      const parsed = command.schema.parse(args);
      return command.handle(...parsed);
    });
  }
};
