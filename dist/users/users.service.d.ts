import { UsersRepository } from './users.repository';
import { Types } from 'mongoose';
export declare class UsersService {
    private usersRepo;
    constructor(usersRepo: UsersRepository);
    createUser(dto: SignupDto): Promise<UserDocument>;
    validateUserCredentials(email: string, password: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findById(id: string | Types.ObjectId): Promise<any>;
    markEmailVerified(userId: string): Promise<any>;
    resetPassword(userId: string, newPassword: string): Promise<any>;
    createStudentUser(dto: any): Promise<UserDocument>;
    createProfessionalUser(dto: any): Promise<UserDocument>;
    createHybridUser(dto: any): Promise<UserDocument>;
}
