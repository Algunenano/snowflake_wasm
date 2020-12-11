function wasm_argon2_hash(password, diffsalt) {
    if (!password || !diffsalt) return null;

    /* We need to transform the JS Strings into a UTF-8 strings,
     * as that's what the library understands */
    const password_length = lengthBytesUTF8(password);
    const wasm_password_buffer = _malloc(password_length + 1);
    stringToUTF8(password, wasm_password_buffer, password_length + 1);

    const diffsalt_length = lengthBytesUTF8(diffsalt);
    const wasm_diffsalt_buffer = _malloc(diffsalt_length + 1);
    stringToUTF8(diffsalt, wasm_diffsalt_buffer, diffsalt_length + 1);

    const version = 0x13; // ARGON2_VERSION_13
    const type = 1; // Argon2_i
    const t_cost = 2;
    const m_cost = 8;
    const paralellism = 1;

    const hash_length = 32;
    const wasm_hash_buffer = null;
    const encoded_length = (hash_length + diffsalt_length + 2) * 2 + 4 * 32;
    const wasm_encoded_buffer = _malloc(encoded_length + 1);

    const hash_result = _argon2_hash(t_cost, m_cost, paralellism,
                wasm_password_buffer, password_length,
                wasm_diffsalt_buffer, diffsalt_length,
                wasm_hash_buffer, hash_length,
                wasm_encoded_buffer, encoded_length,
                type, version);

    let final_string;
    if (hash_result == 0) {
        final_string = UTF8ToString(wasm_encoded_buffer, encoded_length);
    }
    _free(wasm_password_buffer);
    _free(wasm_diffsalt_buffer);
//     _free(wasm_hash_buffer); // Unused
    _free(wasm_encoded_buffer);

    if (hash_result) {
        throw `Could not calculate argon2 hash (Error ${hash_result}). Inputs: ${password} -- ${diffsalt}`;
    }

    return final_string; 
}
Module["wasm_argon2_hash"] = wasm_argon2_hash;


function wasm_argon2_verify(hash, password) {
    if (!password || !hash) return false;

    const hash_length = lengthBytesUTF8(hash);
    const wasm_hash_buffer = _malloc(hash_length + 1);
    stringToUTF8(hash, wasm_hash_buffer, hash_length + 1);

    const password_length = lengthBytesUTF8(password);
    const wasm_password_buffer = _malloc(password_length + 1);
    stringToUTF8(password, wasm_password_buffer, password_length + 1);

    const type = 1; // Argon2_i -- Needs to match the one used in wasm_argon2_hash
    const verify_result = _argon2_verify(wasm_hash_buffer, wasm_password_buffer, password_length, type);

    _free(wasm_password_buffer);
    _free(wasm_hash_buffer);

    if (verify_result !== 0 && verify_result !== -35) {
        throw `Could not verify argon2 hash (Error ${verify_result}). Inputs: ${hash} -- ${password}`;
    }

    return verify_result == 0;
}
Module["wasm_argon2_verify"] = wasm_argon2_verify;
