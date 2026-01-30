import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto, UpdateUserDto } from './dto/index.js';
import { User } from '../../db/schema/index.js';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findByEmail(createUserDto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = crypto
            .createHash('sha256')
            .update(createUserDto.password)
            .digest('hex');

        const { password, ...userData } = createUserDto;
        return this.usersRepository.create({
            ...userData,
            passwordHash,
        });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.findAll();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findByEmail(email);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findOne(id);

        if (updateUserDto.password) {
            const passwordHash = crypto
                .createHash('sha256')
                .update(updateUserDto.password)
                .digest('hex');
            const { password, ...userData } = updateUserDto;
            const updated = await this.usersRepository.update(id, { ...userData, passwordHash });
            return updated!;
        }

        const { password, ...userData } = updateUserDto;
        const updated = await this.usersRepository.update(id, userData);
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.usersRepository.softDelete(id);
    }
}
