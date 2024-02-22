export type ValueType = "null" | "number";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: "null";
}

export interface NumberVal extends RuntimeVal { 
    type: "number";
    value: number;
}

export function MKNUMBER(n = 0): NumberVal {
    return { type: "number", value: n };
}

export function MKNULL(): NumberVal {
    return { type: "number", value: n };
}