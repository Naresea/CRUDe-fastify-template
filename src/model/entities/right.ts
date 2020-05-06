import { User } from './user';
import { EntitySchema } from 'typeorm';

export class Right {
    public id: number;
    public name: string;
    public user: User;

    constructor(id: number, name: string, user: User) {
        this.id = id;
        this.name = name;
        this.user = user;
    }
}

export const RightSchema = new EntitySchema<Right>({
    name: 'rights',
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
        user: {
            type: 'many-to-one',
            target: 'users',
            joinColumn: true,
        },
    },
});
