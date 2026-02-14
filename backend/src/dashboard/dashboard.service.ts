
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async getStats() {
        // 1. Total Revenue
        const { data: orders } = await this.supabase
            .from('orders')
            .select('total_amount');

        const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

        // 2. Active Orders
        const { count: activeOrders } = await this.supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'Delivered')
            .neq('status', 'Cancelled');

        // 3. New Prescriptions
        const { count: newPrescriptions } = await this.supabase
            .from('prescriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Pending');

        // 4. Total Users
        const { count: totalUsers } = await this.supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        return {
            totalRevenue,
            activeOrders: activeOrders || 0,
            newPrescriptions: newPrescriptions || 0,
            totalUsers: totalUsers || 0,
        };
    }
}
