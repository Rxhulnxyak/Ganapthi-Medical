
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { supabase } from "../../lib/supabase";

// Define TypeScript interface for window.Razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}

import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart(); // Use the hook!
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("upi"); // Default to UPI

    // No need for useEffect -> localStorage logic anymore!
    // cartTotal comes directly from context.

    const handlePayment = async () => {
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please login to continue");
                router.push("/login"); // Fixed path
                return;
            }

            // Function to save order to DB
            const saveOrderToDB = async (paymentStatus: string, razorpayData?: any) => {
                const orderPayload = {
                    user_id: user.id,
                    total_amount: cartTotal,
                    status: 'Pending', // Initial status
                    items: cart.map(item => ({
                        medicine_id: item.id, // ID is medicine_id
                        quantity: item.quantity,
                        price: item.price
                    }))
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });

                if (!res.ok) throw new Error("Failed to save order");
                return await res.json();
            };

            if (selectedMethod === "cod") {
                // Handle COD Logic
                await saveOrderToDB('Pending'); // Save as Pending
                alert("Order Placed Successfully via COD!");
                localStorage.removeItem("ganapathi_cart"); // Correct key
                clearCart(); // Use context function
                router.push("/orders");
                return;
            }

            // Razorpay Flow
            // 1. Create Razorpay Order
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/payments/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: cartTotal,
                    order_id: `ORDER_${Date.now()}`,
                }),
            });

            if (!response.ok) throw new Error("Failed to initiate payment");
            const orderData = await response.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "Ganapathi Medical",
                description: "Medicine Order",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/payments/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.status === "success") {
                            // 4. Save to Database
                            await saveOrderToDB('Paid', response);
                            alert("Payment Successful!");
                            localStorage.removeItem("ganapathi_cart");
                            clearCart();
                            router.push("/orders");
                        } else {
                            alert("Payment Verification Failed");
                        }
                    } catch (err) {
                        console.error("Order Save Error:", err);
                        alert("Payment successful but failed to save order. Contact support.");
                    }
                },
                prefill: {
                    name: user.user_metadata?.full_name || "User",
                    email: user.email,
                    contact: user.phone || "",
                },
                theme: {
                    color: "#2563EB",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-5 pb-32 font-display text-slate-800 dark:text-slate-100">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <header className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold">Checkout</h1>
            </header>

            {/* Address Section */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-lg">Delivery Address</h2>
                    <button className="text-primary text-sm font-semibold">Change</button>
                </div>
                <div className="flex gap-3 items-start">
                    <span className="material-icons text-slate-400 mt-1">location_on</span>
                    <div>
                        <p className="font-medium">Home</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">123, Green Park, Hyderabad, Telangana - 500032</p>
                    </div>
                </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-4">Payment Method</h2>

                <div className="space-y-3">
                    {/* UPI Option */}
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-700'}`}>
                        <input type="radio" name="payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-5 h-5 accent-primary" />
                        <div className="flex-1">
                            <span className="font-bold block">UPI (GPay, PhonePe, Paytm)</span>
                            <span className="text-xs text-slate-500">Fast & Secure</span>
                        </div>
                        <span className="material-icons text-green-500">smartphone</span>
                    </label>

                    {/* Card Option */}
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-700'}`}>
                        <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-5 h-5 accent-primary" />
                        <div>
                            <span className="font-bold block">Credit / Debit Card</span>
                            <span className="text-xs text-slate-500">Visa, Mastercard, RuPay</span>
                        </div>
                        <span className="material-icons text-blue-500">credit_card</span>
                    </label>

                    {/* COD Option */}
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-700'}`}>
                        <input type="radio" name="payment" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-5 h-5 accent-primary" />
                        <div>
                            <span className="font-bold block">Cash on Delivery</span>
                            <span className="text-xs text-slate-500">Pay lightly extra</span>
                        </div>
                        <span className="material-icons text-orange-500">monetization_on</span>
                    </label>
                </div>
            </section>

            {/* Bill Details */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm mb-24">
                <h2 className="font-bold text-lg mb-4">Bill Details</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>Item Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Delivery Fee</span>
                        <span className="text-green-500">Free</span>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-2 pt-2 flex justify-between font-bold text-lg">
                        <span>To Pay</span>
                        <span>₹{cartTotal}</span>
                    </div>
                </div>
            </section>

            {/* Proceed Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/30 active:scale-95 transition-transform disabled:opacity-70 flex justify-center gap-2"
                >
                    {loading ? (
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>Pay ₹{cartTotal}</span>
                            <span className="material-icons">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}
