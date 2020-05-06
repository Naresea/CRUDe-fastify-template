import { EntitySchema } from 'typeorm';
import { UserSchema } from './user';
import { RightSchema } from './right';

export function getEntities(): Array<EntitySchema> {
    return [UserSchema, RightSchema];
}
