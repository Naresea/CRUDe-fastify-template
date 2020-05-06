#!/usr/bin/env sh

export TYPEORM_CONNECTION="sqlite"
export TYPEORM_HOST="localhost"
export TYPEORM_USERNAME=""
export TYPEORM_PASSWORD=""
export TYPEORM_DATABASE=":memory:"
export TYPEORM_PORT="5432"
export TYPEORM_SYNCHRONIZE="true"
export FASTIFY_LOGGER="true"
export FASTIFY_PORT="3000"
export FASTIFY_BIND="127.0.0.1"

exec node ./dist/server.js