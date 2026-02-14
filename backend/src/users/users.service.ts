
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(userDto: any) {
        const { data, error } = await this.supabase
            .from('profiles') // Assuming 'profiles' table for user details in Supabase
            .insert([userDto])
            .select();

        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

    async findOne(email: string) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        // if (error) throw new Error(error.message); // Supabase returns error if not found, usually we handle it gracefully
        return data;
    }

    async findById(id: string) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        return data;
    }
}
