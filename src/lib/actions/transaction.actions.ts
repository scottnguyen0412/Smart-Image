'use server';

import { redirect } from "next/navigation";
import Stripe from "stripe";
import Transaction from "../db/models/transaction.model";
import { connectToDB } from "../db/mongoose";
import { handleError } from "../utils";
import { updateCredits } from "./user.actions";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
    const stripe = new Stripe(process.env.STRIPE_SESCRET_KEY!)

    const amount = Number(transaction.amount * 100);

    const sessions = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: amount,
                    product_data: {
                        name: transaction.plan
                    }
                },
                quantity: 1
            }
        ],
        metadata: {
            plan: transaction.plan,
            credits: transaction.credits,
            buyerId: transaction.buyerId,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}/`,
    })

    redirect(sessions.url!); //không được null hoặc undefined.
}

export async function createTransactions(transaction: CreateTransactionParams){
    try {
        await connectToDB();

        // create new transaction with buyer
        const newTransaction = await Transaction.create({
            ...transaction,
            buyer: transaction.buyerId
        })

        await updateCredits(transaction.buyerId, transaction.credits);

        return JSON.parse(JSON.stringify(newTransaction))
    } catch (error) {
        handleError(error)
    }
}