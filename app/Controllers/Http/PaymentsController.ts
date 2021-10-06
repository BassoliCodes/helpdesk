import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Stripe from 'stripe'
import UserPlan from 'App/Models/UserPlan'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class PaymentsController {
    public async createPayment({ response, request }: HttpContextContract) {
        try {
            const data = request.all()

            const stripe = new Stripe(Env.get('STRIPE_SECRET_KEY'), {
                apiVersion: '2020-08-27',
            })

            const session_payment = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: data.email,
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: 'Upgrade de Plano | HelpDesk',
                                images: ['https://i.imgur.com/tmYqjjg.png'],
                                description: 'Upgrade do plano free para o plano Pro do helpdesk.',
                            },
                            unit_amount: parseInt(Env.get('PLAN_PRICE')),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `http://localhost:3333/payment/success?id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:3333/payment/cancel?id={CHECKOUT_SESSION_ID}`,
            })

            return response.redirect(`${session_payment.url}`)
        } catch (error) {
            console.log('Ocorreu um erro ao criar o pagamento!')
            console.log(error)
        }
    }

    public async showSuccessPayment({ view }: HttpContextContract) {
        return view.render('dashboard/payments/success')
    }

    public async showDeclinePayment({ view }: HttpContextContract) {
        return view.render('dashboard/payments/success')
    }

    public async searchPayment({ response, request }: HttpContextContract) {
        try {
            const id = request.parsedUrl.query

            if (!id) {
                return response.redirect('/me')
            }

            const payId = id.split('id=')

            const stripe = new Stripe(Env.get('STRIPE_SECRET_KEY'), {
                apiVersion: '2020-08-27',
            })

            const session = await stripe.checkout.sessions.retrieve(payId[1], {
                expand: ['line_items'],
            })

            if (!session) {
                return response.redirect('/me')
            }

            if (session.payment_status == 'paid') {
                const userData = await User.findBy('email', session.customer_details?.email)

                if (!userData) {
                    return response.redirect('/me')
                }

                const userPlan = await UserPlan.findBy('user_id', userData.id)

                if (!userPlan) {
                    return response.redirect('/me')
                }

                userPlan.plan = 'PRO'
                await userPlan.save()

                await Mail.sendLater(message => {
                    message
                        .from(Env.get('SMTP_USERNAME'))
                        .to(userData.email)
                        .subject('Pagamento aprovado!')
                        .htmlView('emails/payments/approved')
                })
            }

            if (session.payment_status == 'unpaid') {
                console.log('nao pago')

                const userData = await User.findBy('email', session.customer_details?.email)

                if (!userData) {
                    return response.redirect('/me')
                }

                const userPlan = await UserPlan.findBy('user_id', userData.id)

                if (!userPlan) {
                    return response.redirect('/me')
                }

                userPlan.plan = 'FREE'
                await userPlan.save()

                await Mail.sendLater(message => {
                    message
                        .from(Env.get('SMTP_USERNAME'))
                        .to(userData.email)
                        .subject('Pagamento recusado!')
                        .htmlView('emails/payments/refused')
                })
            }

            return response.status(200).json({
                message: `O status do pagamento é ${session.payment_status}!`,
                session,
            })
        } catch (error) {
            console.log(error)
        }
    }
}
