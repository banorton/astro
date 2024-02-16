import Parser from "./compiler/parser";
// import * as fs from 'fs';
// import * as process from 'process';

// const source = fs.readFileSync(process.argv.slice(2,3)[0], 'utf8');

astro();

function astro() {
    const parser = new Parser();
    console.log("\nastro v0.1");
    while (true) {
        const input = prompt("> ");
        if (!input || input.includes("exit")) {
            throw new Error();
        }

        const program = parser.createAST(input);
        console.log(program)
    }
}