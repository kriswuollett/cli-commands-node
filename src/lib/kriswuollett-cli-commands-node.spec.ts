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

import { ArgumentParser } from 'argparse';
import { CliRunner, Command } from './kriswuollett-cli-commands-node';

describe('Command', () => {
  const command: Command = {
    name: 'doSomething',
    help: 'does some work',
    addArguments: (argParser) => {
      argParser.add_argument('--foo', { help: 'bar would be nice' });
    },
    execute: (args) => {
      if (args.foo != null && args.foo != 'bar') {
        return Promise.reject('foo is not bar');
      }
      return Promise.resolve();
    },
  };

  it('should have name', () => {
    expect(command.name).toEqual('doSomething');
  });

  it('should be in help', () => {
    const parser = new ArgumentParser({
      description: 'Test description',
      prog: 'test-app',
      exit_on_error: false,
    });
    new CliRunner(parser, [command]);
    expect(parser.format_help()).toContain('does some work');
  });

  describe('can exec', () => {
    const parser = new ArgumentParser({
      description: 'Test description',
      prog: 'test-app',
      exit_on_error: false,
    });
    const runner = new CliRunner(parser, [command]);

    it('with success', async () => {
      const argv = ['doSomething', '--foo=bar'];
      await expect(runner.run(argv)).resolves.toBeUndefined;
    });

    it('with failure', async () => {
      const argv = ['doSomething', '--foo=baz'];
      await expect(runner.run(argv)).rejects.toEqual('foo is not bar');
    });
  });
});
