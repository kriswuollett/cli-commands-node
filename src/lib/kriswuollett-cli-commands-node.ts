/*
 *  Copyright 2021 Kristopher Wuollett
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { ArgumentParser, SubParser } from 'argparse';

export interface Command {
  readonly name: string;
  readonly aliases?: string[] | undefined;
  readonly help?: string | undefined;
  readonly addArguments: (argParser: ArgumentParser) => void;
  readonly execute: (args: Record<string, unknown>) => Promise<void>;
}

export class CliRunner {
  private readonly argParser: ArgumentParser;
  private readonly commands: ReadonlyMap<string, Command>;
  private readonly parsers: ReadonlyMap<string, ArgumentParser>;

  constructor(argParser: ArgumentParser, commands: Command[]) {
    this.argParser = argParser;
    const subParser: SubParser = this.argParser.add_subparsers({
      title: 'command',
      help: 'Select one of:',
      dest: 'command',
      required: true,
    });

    const commandsMap = new Map<string, Command>();
    const parsersMap = new Map<string, ArgumentParser>();
    commands.forEach((command) => {
      if (command.name == null || command.name.length == 0) {
        throw Error('command.name missing or empty');
      }
      if (commandsMap.has(command.name)) {
        throw Error('duplicate command.name: ' + command.name);
      }
      const commandParser = subParser.add_parser(command.name, {
        help: command.help,
        aliases: command.aliases || [],
      });
      command.addArguments(commandParser);
      parsersMap.set(command.name, commandParser);
      commandsMap.set(command.name, command);
    });
    this.commands = commandsMap;
    this.parsers = parsersMap;
  }

  async run(argv: string[]) {
    let args: Record<string, unknown>;
    try {
      args = this.argParser.parse_args(argv);
    } catch (error) {
      return Promise.reject(error);
    }
    const commandName = args.command as string;
    if (!this.commands.has(commandName)) {
      throw Error('Command not found: ' + commandName);
    }
    const command: Command = this.commands.get(commandName);
    return command.execute(args);
  }
}
