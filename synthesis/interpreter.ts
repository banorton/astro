import { ValueType, RuntimeVal, NumberVal, NullVal, MKNULL, MKNUMBER } from "./values"
import { Assignment, BinaryExpression, Identifier, NodeType, NumericLiteral, Program, Statement, Declaration } from "../analysis/ast"
import { Runtime } from "inspector";
import Environment from "./environment";
import { env } from "process";

export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: (astNode as NumericLiteral).symbol } as NumberVal;;
        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env);
        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);
        case "Declaration":
            return evaluateDeclaration(astNode as Declaration, env);
        case "Assignment":
            return evaluateAssignment(astNode as Assignment, env);
        case "Program":
            return evaluateProgram(astNode as Program, env);
        default:
            throw new Error(`This AST Node has not yet been setup for interpretation: '${astNode.kind}'`);
    }
}

function evaluateProgram(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MKNULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}

function evaluateDeclaration(vardec: Declaration, env: Environment): RuntimeVal {
    const val = vardec.value ? evaluate(vardec.value, env) : MKNULL();
    return env.declareVar(vardec.id, val, vardec.constant);
}

function evaluateAssignment(assign: Assignment, env: Environment): RuntimeVal {
    if (assign.left.kind !== "Identifier") {
        throw new Error(`Invalid type for left side of assignment: '${assign.left.kind}'`)
    }

    const varname = (assign.left as Identifier).symbol;
    return env.assignVar(varname, evaluate(assign.right, env));
}

function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
    const op = binop.operator;

    if (lhs.type == "number" && rhs.type == "number") {
        return evaluateNumericBinaryExpression(lhs as NumberVal, rhs as NumberVal, op as string);
    }

    return MKNULL();
}

function evaluateIdentifier(iden: Identifier, env: Environment): RuntimeVal {
    const val = env.findVar(iden.symbol);
    return val;
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