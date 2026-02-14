
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async login(user: any) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password,
        });

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async register(userDto: any) {
        const { data, error } = await this.supabase.auth.signUp({
            email: userDto.email,
            password: userDto.password,
            options: {
                data: {
                    name: userDto.name,
                    role: 'user', // Default role
                },
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        // In Supabase, 'profiles' table is usually handled by triggers on auth.users insert.
        // If not using triggers, we might manually insert here, but Supabase best practice is triggers.
        // However, for simplicity/NoSQL mindset, let's assume we might need to insert if no trigger exists.
        // But usually basic auth returns the user object which is enough for login.

        return data;
    }
}
