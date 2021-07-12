import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import Category from 'App/Models/Category';
import UserPlan from 'App/Models/UserPlan';

export default class DashboardController {
    public async showIndex({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const planUser = await UserPlan.findBy('user_id', userData.id);

        if (!planUser) {
            await auth.logout();
            return response.redirect('/login');
        }

        const name = userData.name.split(' ');

        return view.render('dashboard/home', {
            user: userData,
            plan: planUser,
            name,
        });
    }

    public async showCategories({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const planUser = await UserPlan.findBy('user_id', userData.id);

        if (!planUser) {
            await auth.logout();
            return response.redirect('/login');
        }

        const name = userData.name.split(' ');

        return view.render('dashboard/categories/index', {
            user: userData,
            plan: planUser,
            name,
        });
    }

    public async showAddCategories({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const planUser = await UserPlan.findBy('user_id', userData.id);

        if (!planUser) {
            await auth.logout();
            return response.redirect('/login');
        }

        const name = userData.name.split(' ');

        return view.render('dashboard/categories/add', {
            user: userData,
            plan: planUser,
            name,
        });
    }

    public async addCategories({ request, response, auth }: HttpContextContract) {
        await auth.use('web').authenticate();

        const validatorSchema = await request.validate({
            schema: schema.create({
                userId: schema.number(),
                name: schema.string({}, [rules.maxLength(255), rules.required()]),
                description: schema.string({}, [rules.maxLength(255), rules.required()]),
            }),
            messages: {
                'name.required': 'Você precisa colocar o nome da categoria!',
                'description.required': 'A descrição é um item obrigatório!',
            },
        });

        await Category.create(validatorSchema);
        return response.redirect('/dashboard');
    }
}
