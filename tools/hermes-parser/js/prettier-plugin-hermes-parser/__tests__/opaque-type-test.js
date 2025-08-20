/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// $FlowExpectedError[cannot-resolve-module]
import prettierConfig from '../../.prettierrc.json';

import * as prettier from 'prettier';

function format(code: string) {
  const options = {
    ...prettierConfig,
    parser: 'hermes',
    requirePragma: false,
    plugins: [require.resolve('../index.mjs')],
  };
  return prettier.format(code, options);
}

describe('Opaque type', () => {
  test('With lower and upper bound', async () => {
    expect(
      await format(`
       declare opaque type Foo super Bar extends Baz;
      `),
    ).toMatchInlineSnapshot(`
      "declare opaque type Foo super Bar extends Baz;
      "
    `);
  });
});
