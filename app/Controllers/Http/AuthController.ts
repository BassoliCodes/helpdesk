import User from 'App/Models/User';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class AuthController {
    public async showLogin({ view }) {
        return view.render('auth/login');
    }

    public async login({ request, response, auth, session }) {
        const { email, password } = request.all();

        try {
            await auth.attempt(email, password);
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
                name: schema.string({}),
                username: schema.string({}),
                email: schema.string({}, [
                    rules.email(),
                    rules.maxLength(255),
                    rules.unique({ table: 'users', column: 'email' }),
                ]),
                password: schema.string({}),
            }),
            messages: {
                required: 'Esses campos são obrigatórios!',
                'email.unique': 'E-mail não pode ser utilizado!',
            },
        });

        const user = await User.create(validatorSchema);
        await auth.use('web').login(user);

        return response.redirect('/dashboard');
    }

    public async logout({ auth, response }) {
        await auth.logout();
        return response.redirect('/login');
    }
}
