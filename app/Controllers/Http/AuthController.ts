import User from 'App/Models/User';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import UserPlan from 'App/Models/UserPlan';

export default class AuthController {
    public async showLogin({ view, auth, response }) {
        await auth.use('web').check();

        if (auth.use('web').isLoggedIn) {
            return response.redirect('/dashboard');
        }

        return view.render('auth/login');
    }

    public async login({ request, response, auth, session }) {
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

    public async showRegister({ view }) {
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

        const user = await User.create(validatorSchema);
        await UserPlan.create({
            userId: user.id,
            days_plan_expiration: '-1',
            plan: 'FREE',
        });
        await auth.use('web').login(user);

        return response.redirect('/dashboard');
    }

    public async logout({ auth, response }) {
        await auth.logout();
        return response.redirect('/login');
    }
}
