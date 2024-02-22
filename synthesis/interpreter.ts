import { ValueType, RuntimeVal, NumberVal, NullVal } from "./values"
import { BinaryExpression, Identifier, NodeType, NumericLiteral, Program, Statement } from "../analysis/ast"
import { Runtime } from "inspector";
import Environment from "./environment";
import { env } from "process";

export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: (astNode as NumericLiteral).symbol } as NumberVal;
        case "NullLiteral":
            return { value: "null", type: "null"} as NullVal;
        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env);
        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);
        case "Program":
            return evaluateProgram(astNode as Program, env);
        default:
            throw new Error("INTERPRETER ERROR: This AST Node has not yet been setup for interpretation. " + astNode);
    }
}

function evaluateIdentifier(iden: Identifier, env: Environment): RuntimeVal {
    const val = env.findVar(iden.symbol);
    return val;
}

function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
    const op = binop.operator;

    if (lhs.type == "number" && rhs.type == "number") {
        return evaluateNumericBinaryExpression(lhs as NumberVal, rhs as NumberVal, op as string);
    }

    return {type: "null", value: "null"} as NullVal;
}

function evaluateNumericBinaryExpression(lhs: NumberVal, rhs: NumberVal, op: string): NumberVal {
    let result = 0;
    if (op == "+") {
        result = lhs.value + rhs.value;
    } else if (op == "-") {
        result = lhs.value - rhs.value;
    } else if (op == "*") {
        result = lhs.value * rhs.value;
    } else if (op == "/") {
        result = lhs.value / rhs.value;
    } else if (op == "%") {
        result = lhs.value % rhs.value;
    }

    return { value: result, type: "number" };
}

function evaluateProgram(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}