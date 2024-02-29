export type NodeType = 
// STATEMENTS
| "Program"
| "Declaration"

// EXPRESSIONS
| "NumericLiteral"
| "Identifier"
| "Assignment"
| "ObjectLiteral"
| "Property"
| "Member"
| "Call"
| "BinaryExpression";

// Statement
export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

export interface Declaration extends Statement {
    kind: "Declaration";
    constant: boolean;
    id: string;
    value?: Expression;
}

// Expression
export interface Expression extends Statement {}

export interface Assignment extends Expression {
    kind: "Assignment";
    left: Expression;
    right: Expression;
}

export interface Call extends Expression {
    kind: "Call";
    caller: Expression;
    args: Expression[];
}

export interface Member extends Expression {
    kind: "Member";
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface Property extends Expression {
    kind: "Property";
    key: string;
    value?: Expression;
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral";
    properties: Property[];
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    symbol: number;
}