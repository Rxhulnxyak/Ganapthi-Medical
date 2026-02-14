
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private razorpayClient: Razorpay;

    constructor(private configService: ConfigService) {
        const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        console.log(`[Payments Service] 🔑 Initializing Razorpay Client (Key ID: ${keyId?.substring(0, 8)}...)`);

        if (!keyId || !keySecret) {
            console.error('[Payments Service] ❌ Missing Razorpay credentials in .env');
        }

        this.razorpayClient = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    async createOrder(orderId: string, amount: number) {
        try {
            const options = {
                amount: amount * 100, // Amount in paise
                currency: "INR",
                receipt: orderId,
                payment_capture: 1, // Auto-capture
            };
            const order = await this.razorpayClient.orders.create(options);
            return order;
        } catch (error) {
            console.error("Razorpay Order Error:", error);
            throw new BadRequestException("Failed to create payment order");
        }
    }

    verifyPayment(orderId: string, paymentId: string, signature: string) {
        const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';
        const generated_signature = crypto.createHmac('sha256', secret)
            .update(orderId + "|" + paymentId)
            .digest('hex');

        if (generated_signature === signature) {
            return { status: 'success', message: 'Payment verified' };
        } else {
            throw new BadRequestException('Invalid payment signature');
        }
    }
}
