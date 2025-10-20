import { Model } from 'mongoose';
import { User } from './schema/users.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(data: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
}
