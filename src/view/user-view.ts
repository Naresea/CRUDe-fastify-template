import userDto from './dtos/schemas/user/user-dto.json';
import { UserController } from '../controller/user.controller';
import { UserDto } from './dtos/user-dto';
import {
    AbstractCrudView,
    CreateCrudRequestParams,
    DeleteCrudRequestParams,
    ReadElementCrudRequestParams,
    UpdateCrudRequestParams,
} from '../scaffold/view/abstract-crud-view';
import { elementIdUrlParamName } from '../scaffold/view/json-schema-utils/schema-crud';

export class UserView extends AbstractCrudView<UserDto> {
    constructor(private readonly userController: UserController) {
        super('/users', userDto);
    }

    public create(input: CreateCrudRequestParams<UserDto>): Promise<UserDto> {
        return this.userController.createUser(input.body);
    }

    public readList(): Promise<Array<UserDto>> {
        return this.userController.getUsers();
    }

    public readElement(input: ReadElementCrudRequestParams<UserDto>): Promise<UserDto> {
        const elementId = input.params[elementIdUrlParamName] as number;
        return this.userController.getUser(elementId);
    }

    public update(input: UpdateCrudRequestParams<UserDto>): Promise<UserDto> {
        const elementId = input.params[elementIdUrlParamName] as number;
        return this.userController.updateUser(elementId, input.body);
    }

    public delete(input: DeleteCrudRequestParams<UserDto>): Promise<UserDto> {
        const elementId = input.params[elementIdUrlParamName] as number;
        return this.userController.deleteUser(elementId);
    }
}
