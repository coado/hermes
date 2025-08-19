/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {MaybeDetachedNode} from '../detachedNode';
import type {Program} from 'hermes-estree';

import {mutateESTreeASTForPrettier} from 'hermes-parser';
import * as prettier from 'prettier';
import {mutateESTreeASTCommentsForPrettier} from './comments/comments';
import type {VisitorKeysType} from 'hermes-parser';

export async function print(
  ast: MaybeDetachedNode<Program>,
  originalCode: string,
  prettierOptions: {...} = {},
  visitorKeys?: ?VisitorKeysType,
): Promise<string> {
  // $FlowExpectedError[incompatible-type] This is now safe to access.
  const program: Program = ast;

  // If the AST body is empty, we can skip the cost of prettier by returning a static string of the contents.
  if (program.body.length === 0) {
    // If the program had a docblock comment, we need to create the string manually.
    const docblockComment = program.docblock?.comment;
    if (docblockComment != null) {
      return '/*' + docblockComment.value + '*/\n';
    }

    return '';
  }

  // Cleanup the comments from the AST and generate the "orginal" code needed for prettier.
  const codeForPrinting = mutateESTreeASTCommentsForPrettier(
    program,
    originalCode,
  );

  // Fix up the AST to match what prettier expects.
  mutateESTreeASTForPrettier(program, visitorKeys);

  let pluginParserName = 'flow';
  let pluginParser;
  let pluginPrinter;
  try {
    // Use prettier-plugin-hermes-parser if we can. It has latest Flow syntax support.
    // $FlowExpectedError[untyped-import]
    const prettierHermesPlugin = await import('prettier-plugin-hermes-parser');
    pluginParser = prettierHermesPlugin.parsers.hermes;
    pluginPrinter = prettierHermesPlugin.printers;
    pluginParserName = 'hermes';
  } catch {
    const prettierFlowPlugin = require('prettier/plugins/flow');
    pluginParser = prettierFlowPlugin.parsers.flow;
  }

  return prettier.format(
    codeForPrinting,
    // $FlowExpectedError[incompatible-exact] - we don't want to create a dependency on the prettier types
    {
      ...prettierOptions,
      parser: pluginParserName,
      requirePragma: false,
      plugins: [
        {
          parsers: {
            [pluginParserName]: {
              ...pluginParser,
              parse() {
                return program;
              },
            },
          },
          printers: pluginPrinter,
        },
      ],
    },
  );
}
