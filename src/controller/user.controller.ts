import { UserDto } from '../view/dtos/user-dto';
import { getConnection, getRepository } from 'typeorm';
import { User, UserSchema } from '../model/entities/user';
import { errorIfNotExists } from '../scaffold/utils/exists';
import { CreateBody, UpdateBody } from '../scaffold/view/abstract-crud-view';
import { RightSchema } from '../model/entities/right';

export class UserController {
    public async getUsers(): Promise<Array<UserDto>> {
        const userEntities = await getRepository(UserSchema).find({ relations: ['rights'] });
        return userEntities.map((entity) => ({
            id: entity.id,
            name: entity.name,
            rights: entity.rights?.map((r) => r.name),
        }));
    }

    public async getUser(id: number): Promise<UserDto> {
        const user = errorIfNotExists(
            await getRepository(UserSchema).findOne(id, { relations: ['rights'] }),
            'No user with this id.'
        );
        return {
            id: user.id,
            name: user.name,
            rights: user.rights.map((r) => r.name),
        };
    }

    public async createUser(user: CreateBody<UserDto>): Promise<UserDto> {
        return getConnection().transaction(async (em) => {
            const insertEntity: Partial<User> = {
                name: user.name,
            };
            let savedEntity = await em.getRepository(UserSchema).save(insertEntity);
            const rights =
                user.rights?.map((r) => ({
                    name: r,
                    user: savedEntity,
                })) ?? [];
            if (rights.length > 0) {
                const savedRights = await em.getRepository(RightSchema).save(rights);
                savedEntity.rights = savedRights;
                savedEntity = await em.getRepository(UserSchema).save(savedEntity);
            }
            return this.getUser(savedEntity.id);
        });
    }

    public async updateUser(id: number, update: UpdateBody<UserDto>): Promise<UserDto> {
        return getConnection().transaction(async (em) => {
            let user = errorIfNotExists(
                await em.getRepository(UserSchema).findOne(id, { relations: ['rights'] }),
                'No user with id.'
            );
            user.name = update.name;
            const rights =
                update.rights?.map((r) => ({
                    name: r,
                    user: user,
                })) ?? [];
            if (rights.length > 0) {
                await em.getRepository(RightSchema).delete(user.rights?.map((r) => r.id) ?? []);
                const savedRights = await em.getRepository(RightSchema).save(rights);
                user.rights = savedRights;
                user = await em.getRepository(UserSchema).save(user);
            }
            return this.getUser(user.id);
        });
    }

    public async deleteUser(id: number): Promise<UserDto> {
        return getConnection().transaction(async (em) => {
            const userEntity = errorIfNotExists(
                await em.getRepository(UserSchema).findOne(id, { relations: ['rights'] }),
                'No user with this id.'
            );
            await em.getRepository(RightSchema).delete(userEntity.rights?.map((r) => r.id) ?? []);
            await em.getRepository(UserSchema).delete(id);
            return {
                id: userEntity.id,
                name: userEntity.name,
                rights: userEntity.rights.map((r) => r.name),
            };
        });
    }
}
