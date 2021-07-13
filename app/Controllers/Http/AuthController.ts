import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import UserPlan from 'App/Models/UserPlan';
import UserHelpdesk from 'App/Models/UserHelpdesk';
import crypto from 'crypto';

export default class AuthController {
    public async showLogin({ view, auth, response }: HttpContextContract) {
        await auth.use('web').check();

        if (auth.use('web').isLoggedIn) {
            return response.redirect('/dashboard');
        }

        return view.render('auth/login');
    }

    public async login({ request, response, auth, session }: HttpContextContract) {
        const { email, password } = request.all();

        const userData = await User.findBy('email', email);

        try {
            await auth.attempt(email, password, userData?.admin);
            return response.redirect('/dashboard');
        } catch (error) {
            session.flash('notification', 'OPS! Informações de login estão incorretas!');
            return response.redirect('back');
        }
    }

    public async showRegister({ view }: HttpContextContract) {
        return view.render('auth/register');
    }

    public async register({ request, auth, response }) {
        const validatorSchema = await request.validate({
            schema: schema.create({
                name: schema.string({}, [rules.minLength(4), rules.maxLength(255)]),
                email: schema.string({}, [
                    rules.email(),
                    rules.minLength(4),
                    rules.maxLength(255),
                    rules.unique({ table: 'users', column: 'email' }),
                ]),
                password: schema.string({}),
            }),
            messages: {
                required: 'Esses campos são obrigatórios!',
                'email.unique': 'E-mail não pode ser utilizado!',
                minLength: 'Esses campos são obrigatórios!',
            },
        });

        const generate_address = await crypto.randomBytes(5).toString('hex');

        const user = await User.create(validatorSchema);
        await UserPlan.create({
            userId: user.id,
            days_plan_expiration: '-1',
            plan: 'FREE',
        });
        await UserHelpdesk.create({
            userId: user.id,
            address: generate_address,
            own_domain: 'Não cadastrado',
            enterprise_name: 'Não cadastrado',
        });
        await auth.use('web').login(user);

        return response.redirect('/dashboard');
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout();
        return response.redirect('/login');
    }
}
