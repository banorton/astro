import { ValueType, RuntimeVal, NumberVal, NullVal } from "./values"
import { BinaryExpression, NodeType, NumericLiteral, Program, Statement } from "../analysis/ast"
import { Runtime } from "inspector";

export function evaluate(astNode: Statement): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: (astNode as NumericLiteral).symbol } as NumberVal;
        case "NullLiteral":
            return { value: "null", type: "null"} as NullVal;
        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression);
        case "Program":
            return evaluateProgram(astNode as Program);
        default:
            throw new Error("INTERPRETER ERROR: This AST Node has not yet been setup for interpretation. " + astNode);
    }
}

function evaluateBinaryExpression(binop: BinaryExpression): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);
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

function evaluateProgram(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    }
    return lastEvaluated;
}