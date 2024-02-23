export type ValueType = "null" | "number" | "boolean";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export interface NumberVal extends RuntimeVal { 
    type: "number";
    value: number;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

export function MKNUMBER(n = 0): NumberVal {
    return { type: "number", value: n };
}

export function MKNULL(): NullVal {
    return { type: "null", value: null } as NullVal;
}

export function MKBOOL(b = true): BooleanVal {
    return { type: "boolean", value: b} as BooleanVal;
}