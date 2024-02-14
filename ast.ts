// export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr" | "CallExpr" | "UnaryExpr" | "FunctionDeclaration";
export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr";

// Statement
export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

// Expression
export interface Expression extends Statement {}

export interface BinaryExpr extends Expression {
    kind: "Identifier"
    left: Expression
    right: Expression
    operator: string;
}

export interface Identifier extends Expression {
    kind: "Identifier"
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral"
    symbol: number;
}