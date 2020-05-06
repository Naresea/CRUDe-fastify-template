import { EntitySchema } from 'typeorm';
import { Right } from './right';

export class User {
    public id: number;
    public name: string;
    public rights: Array<Right> = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export const UserSchema = new EntitySchema<User>({
    name: 'users',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
        },
    },
    relations: {
        rights: {
            type: 'one-to-many',
            target: 'rights',
            inverseSide: 'user',
        },
    },
});
