import {
  line,
  hardline,
  softline,
  group,
  indent,
  ifBreak,
} from "../../document/builders.js";
import getNextNonSpaceNonCommentCharacter from "../../utils/get-next-non-space-non-comment-character.js";
import { printDanglingComments } from "../../main/comments/print.js";
import { locEnd } from "../loc.js";
import { shouldPrintComma, isNextLineEmpty } from "../utils/index.js";
import { printTypeAnnotationProperty } from "./type-annotation.js";
import { printDeclareToken } from "./misc.js";
import { printFunctionParameters, shouldGroupFunctionParameters } from "./function-parameters.js";
import { printReturnType } from "./function.js";
import { printFunctionTypeParameters } from "./misc.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

/*
- "HookDeclaration"
- "DeclareHook"
- "HookTypeAnnotation"
*/
function printHook(path, options, print) {
  const { node } = path;

  const parts = [printDeclareToken(path), "hook"];
  if (node.id) {
    parts.push(" ", print("id"));
  }

  const parametersDoc = printFunctionParameters(path, print, options, false, true);
  const returnTypeDoc = printReturnType(path, print);
  const shouldGroupParameters = shouldGroupFunctionParameters(
    node,
    returnTypeDoc,
  );

  parts.push(
    printFunctionTypeParameters(path, options, print),
    group([
      shouldGroupParameters ? group(parametersDoc) : parametersDoc,
      returnTypeDoc,
    ]),
    node.body ? " " : "",
    print("body"),
  );

  if (options.semi && (node.declare || !node.body)) {
    parts.push(";");
  }


  parts.push(group([parametersDoc]));

  return parts;
}

export { printHook };
