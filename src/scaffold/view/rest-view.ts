import { FastifyInstance } from 'fastify';

export interface RestView {
    defineEndpoints(server: FastifyInstance): void;
}
