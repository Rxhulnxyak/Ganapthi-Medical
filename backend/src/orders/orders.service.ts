
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(createOrderDto: any) {
        const { items, ...orderData } = createOrderDto;

        // 1. Insert Order
        const { data: order, error: orderError } = await this.supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (orderError) {
            console.error("Order Insert Error:", orderError);
            throw new Error(orderError.message);
        }

        if (items && items.length > 0) {
            const orderItems = items.map((item: any) => ({
                order_id: order.id,
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error("Order Items Insert Error:", itemsError);
                // Optional: Disable rollback since Supabase doesn't support transactions easily in client lib
                throw new Error(itemsError.message);
            }
        }

        return order;
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*, order_items(*, medicines(*))'); // Joined query example

        if (error) throw new Error(error.message);
        return data;
    }
    async update(id: string, updateOrderDto: any) {
        const { data, error } = await this.supabase
            .from('orders')
            .update(updateOrderDto)
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
        return data;
    }
}
