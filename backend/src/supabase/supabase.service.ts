
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.supabase = createClient(
            this.configService.get('SUPABASE_URL') || '',
            this.configService.get('SUPABASE_KEY') || '',
        );
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}
