export type NodeType = 
// STATEMENTS
| "Program"
| "VariableDeclaration"

// EXPRESSIONS
| "NumericLiteral"
| "Identifier" 
| "BinaryExpression";

// Statement
export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    constant: boolean;
    id: string;
    value?: Expression;
}

// Expression
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    symbol: number;
}