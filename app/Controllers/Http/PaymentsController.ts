import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class PaymentsController {
    public async createPayment({ response, request, session }: HttpContextContract) {
        const data = request.all();

        if (!data) {
            session.flash(
                'error',
                'Você precisa passar todos os parametros para criar seu pagamento!',
            );
            return response.redirect('back');
        }

        //Create payment with MercadoPago
        if (data.method == 'MercadoPago') {
            session.flash('success', 'Criando pagamento com mercadopago!');
            return response.redirect('back');
        }

        //Create payment with Stripe
        if (data.method == 'Stripe') {
            session.flash('success', 'Criando pagamento com stripe!');
            return response.redirect('back');
        }
    }

    public async mercadopagoNotification({}: HttpContextContract) {}

    public async stripeNotification({}: HttpContextContract) {}
}
