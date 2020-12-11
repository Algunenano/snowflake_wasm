Object.assign(global, require('./argon2.js'));

const p1 = "password";
const p2 = "password2";

const salt1 = "somesalt1";
const salt2 = "somesalt2";

const hash1 = wasm_argon2_hash(p1, salt1);
const hash2 = wasm_argon2_hash(p2, salt2);

console.log("Should be ok:");
console.log(wasm_argon2_verify(hash1, p1));
console.log(wasm_argon2_verify(hash2, p2));

console.log("Should be ko:");
console.log(wasm_argon2_verify(hash1, p2));
console.log(wasm_argon2_verify(hash2, p1));
