
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MedicinesService {
    private cache: { data: any[] | null; timestamp: number } = { data: null, timestamp: 0 };
    private readonly CACHE_TTL = 30000; // 30 seconds cache

    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    private isCacheValid(): boolean {
        return this.cache.data !== null && (Date.now() - this.cache.timestamp) < this.CACHE_TTL;
    }

    async findAll() {
        const start = Date.now();

        // Return cached data if available
        if (this.isCacheValid()) {
            console.log(`[Medicines Service] ⚡ Serving from cache (${this.cache.data?.length || 0} items) - INSTANT`);
            return this.cache.data;
        }

        console.log('[Medicines Service] 🔄 Cache miss, querying Supabase...');

        const { data, error } = await this.supabase
            .from('medicines')
            .select('id, name, category, price, stock, requires_prescription, image_url')
            .order('created_at', { ascending: false })
            .limit(100);

        const end = Date.now();
        console.log(`[Medicines Service] ⏱️  Database Query Time: ${end - start}ms, Rows: ${data?.length || 0}`);

        if (error) throw new Error(error.message);

        // Update cache
        this.cache = { data, timestamp: Date.now() };

        return data;
    }

    async findOne(id: string) {
        const { data, error } = await this.supabase
            .from('medicines')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async create(createMedicineDto: any) {
        const { data, error } = await this.supabase
            .from('medicines')
            .insert([createMedicineDto])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            throw new Error(error.message);
        }

        // Invalidate cache
        this.cache.data = null;

        return data[0];
    }

    async update(id: string, updateMedicineDto: any) {
        const { data, error } = await this.supabase
            .from('medicines')
            .update(updateMedicineDto)
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);

        // Invalidate cache
        this.cache.data = null;

        return data ? data[0] : null;
    }

    async remove(id: string) {
        const { error } = await this.supabase
            .from('medicines')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);

        // Invalidate cache
        this.cache.data = null;

        return { message: 'Deleted successfully' };
    }
}
