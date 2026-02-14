
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':email')
    findOne(@Param('email') email: string) {
        return this.usersService.findOne(email);
    }

    // Create profile usually happens on auth signup, but exposing just in case
    @Post()
    create(@Body() userDto: any) {
        return this.usersService.create(userDto);
    }
}
