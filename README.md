# kriswuollett-cli-commands-node

This library was generated with [Nx](https://nx.dev). Although it may be used without `nx`,
instructions here only cover usage with `nx`.

## Using

Add this repo as a git submodule in project. Place it in
`libs/kriswuollett-cli-commands-node`.

Update `paths` in `tsconfig.base.json` to contain at least:

```json
"paths": {
    "@kriswuollett/cli-commands": [
        "libs/kriswuollett-cli-commands-node/src/index.ts"
    ]
}
```

Update `projects` in `workspace.json` to have at least:

```json
"projects": {
    "kriswuollett-cli-commands-node": "libs/kriswuollett-cli-commands-node"
},
```

## Running unit tests

If using `nx`, run `nx test kriswuollett-cli-commands-node` to execute the unit tests via
[Jest](https://jestjs.io).
