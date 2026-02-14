
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PrescriptionsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(createPrescriptionDto: any) {
        // Expects: { user_id, image_url, ... }
        const { data, error } = await this.supabase
            .from('prescriptions') // 'prescriptions' table in Supabase
            .insert([createPrescriptionDto])
            .select();

        if (error) throw new Error(error.message);
        return data[0];
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('prescriptions')
            .select('*') // profiles join removed due to missing FK relationship
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data, error } = await this.supabase
            .from('prescriptions')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
        return data[0];
    }
}
