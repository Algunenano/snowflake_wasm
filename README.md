## Snowflake WASM prototype

Blog post can be found [here](https://rmr.ninja/2020-12-14-Snowflake-WebAssembly/).

Contents:
``` 
├── argon2/         - Comes from come from [here](https://github.com/P-H-C/phc-winner-argon2) and are used under the Apache Public License 2.0.
├── argon2.js       - Complete JS file that includes the compiled WASM
├── argon2.lo       - Temporal library containing LLVM bitcode
├── argon2.sql      - Final SQL functions that can be used in Snowflake
├── LICENSE         - License file ( Apache Public License 2.0)
├── Makefile        - Basic Makefile that uses Emscripten to build the project
├── README.md       - This file
├── simpletest.js   - Simple script to test the funcionality with node
├── template.sql    - Templates for the SQL functions 
└── wasm_helpers.js - Functions to wrap the WASM calls
```
