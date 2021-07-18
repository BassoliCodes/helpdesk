import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import Stripe from 'stripe';

export default class PaymentsController {
    public async createPayment({ response, request, session }: HttpContextContract) {
        const data = request.all();

        const APP_DOMAIN = Env.get('APP_DOMAIN');

        if (!data) {
            session.flash(
                'error',
                'Você precisa passar todos os parametros para criar seu pagamento!',
            );
            return response.redirect('back');
        }

        /**
         *
         *
         *
         */
        const stripe = new Stripe(
            'pk_test_51H6w2jH8Y9SrxDvcQ6dAwP7F1svf9zZmpAmy19Ket24PBHRNOdD7WQG03WQlB8PvMwRcALfC9lxD1VVugYt4S0yT00VMEh1tmV',
            {
                apiVersion: '2020-08-27',
            },
        );

        const session_payment = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],

            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'Upgrade de Plano | HelpDesk',
                            images: ['https://i.imgur.com/EHyR2nP.png'],
                            description: 'Upgrade do plano free para o plano Pro do helpdesk.',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${APP_DOMAIN}/success.html`,
            cancel_url: `${APP_DOMAIN}/cancel.html`,
        });
    }

    public async mercadopagoNotification({}: HttpContextContract) {}

    public async stripeNotification({}: HttpContextContract) {}
}
