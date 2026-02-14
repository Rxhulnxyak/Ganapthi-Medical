
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-order')
    async createOrder(@Body() body: { amount: number; order_id: string }) {
        console.log(`[Payments Controller] 💳 Creating order: ${body.order_id}, Amount: ${body.amount}`);
        // In production, fetch amount from Order ID in DB, do NOT trust body amount
        const order = await this.paymentsService.createOrder(body.order_id, body.amount);
        return order;
    }

    @Post('verify')
    async verifyPayment(@Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
        return this.paymentsService.verifyPayment(
            body.razorpay_order_id,
            body.razorpay_payment_id,
            body.razorpay_signature
        );
    }
}
