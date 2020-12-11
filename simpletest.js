Object.assign(global, require('./argon2.js'));

while (true) {
    wasm_argon2_hash("password", "somesalt");
}
