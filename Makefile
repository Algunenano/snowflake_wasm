WASM_TARGET = argon2.js

all: ${WASM_TARGET}

SRC_FILES = argon2/argon2.c argon2/core.c argon2/ref.c argon2/thread.c argon2/encoding.c argon2/blake2/blake2b.c
CFLAGS_INCLUDE = -I./argon2
CFLAGS = -flto=full -O3 $(CFLAGS_INCLUDE)

JS_HELPERS = --post-js wasm_helpers.js
WASM_MEMORY = -s INITIAL_MEMORY=200MB
WASM_FLAGS = $(WASM_MEMORY) -s DYNAMIC_EXECUTION=0 -s WASM_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s ENVIRONMENT="node,shell" $(JS_HELPERS)

WASM_FORMAT = -s WASM=1 $(WASM_FLAGS)

EXPORTED_FUNCTIONS = '[ \
	"_argon2_hash", \
	"_argon2_verify", \
	\
	"_malloc", \
	"_free"]'

EXTRA_EXPORTED_RUNTIME_METHODS = '[ \
	"stringToUTF8", \
	"UTF8ToString", \
	"getValue" \
	]'

${WASM_TARGET}: $(SRC_FILES)
	emcc ${CFLAGS} $^ -o $@ ${WASM_FORMAT} \
		-s EXPORTED_FUNCTIONS=${EXPORTED_FUNCTIONS} \
		-s EXTRA_EXPORTED_RUNTIME_METHODS=${EXTRA_EXPORTED_RUNTIME_METHODS}

.PHONY: clean
clean:
	rm -f ${WASM_TARGET}
