import { RuntimeVal } from "./values";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor(parent?: Environment) {
        this.parent = parent;
        this.variables = new Map();
    }

    public declareVar(varname: string, value: RuntimeVal) {
        if (this.variables.has(varname)) {
            throw new Error(`The variable '${varname}' cannot be declared as it already exists.`);
        }

        this.variables.set(varname, value);
        return value;
    }

    public assignVar(varname: string, value: RuntimeVal) {
        const env = this.resolve(varname);
        env.variables.set(varname, value);
        return value;
    }

    public findVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve(varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }
        
        if (this.parent == undefined) {
            throw new Error(`Could not resolve variable: '${varname}.'`);
        }

        return this.parent.resolve(varname);
    }
}