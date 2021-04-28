module.exports = function (plop) {
    plop.setGenerator("command", {
        description: "Creates a new command",
        prompts: [
            {
                type: "input",
                name: "hyphenCaseName",
                message: "command name in kebab-case",
            },
            {
                type: "input",
                name: "PascalCaseName",
                message: "command name in PascalCase",
            },
        ],
        actions: [
            {
                type: "add",
                path: "packages/server/src/lib/{{hyphenCaseName}}/index.ts",
                templateFile: "templates/index.ts.hbs",
            },
            {
                type: "add",
                path: "packages/server/src/lib/{{hyphenCaseName}}/index.test.ts",
                templateFile: "templates/index.test.ts.hbs",
            }
        ]
    })
}