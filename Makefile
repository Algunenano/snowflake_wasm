SQL_TARGET = argon2.sql
WASM_TARGET = argon2.js
LLVM_LIB = argon2.lo

all: ${SQL_TARGET}

SRC_FILES = argon2/argon2.c argon2/core.c argon2/ref.c argon2/thread.c argon2/encoding.c argon2/blake2/blake2b.c
CPPFLAGS = -I./argon2
CFLAGS = -O3
LDFLAGS = -O3

WASM_FLAGS = -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s WASM_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 --post-js wasm_helpers.js

EXPORTED_FUNCTIONS = '[ \
		"_argon2_hash", \
		"_argon2_verify", \
		"_malloc", \
		"_free" \
	]'

EXTRA_EXPORTED_RUNTIME_METHODS = '[ \
		"stringToUTF8", \
		"UTF8ToString" \
	]'

# Intermediate library to avoid full recompilation when changing `post-js` files
${LLVM_LIB}: $(SRC_FILES)
	emcc ${CPPFLAGS} ${CFLAGS} -r $^ -o $@

${WASM_TARGET}: $(LLVM_LIB) wasm_helpers.js
	emcc ${LDFLAGS} $(LLVM_LIB) -o $@ ${WASM_FLAGS} \
		-s EXPORTED_FUNCTIONS=${EXPORTED_FUNCTIONS} \
		-s EXTRA_EXPORTED_RUNTIME_METHODS=${EXTRA_EXPORTED_RUNTIME_METHODS}

${SQL_TARGET}: ${WASM_TARGET} template.sql
	sed -e '/@@WASM_FILE_CONTENTS@@/ r ${WASM_TARGET}' -e '/@@WASM_FILE_CONTENTS@@/d' template.sql > $@

.PHONY: clean
clean:
	rm -f ${WASM_TARGET} ${LLVM_LIB} ${SQL_TARGET}
