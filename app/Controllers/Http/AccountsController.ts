import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import UserPlan from 'App/Models/UserPlan';
import Env from '@ioc:Adonis/Core/Env';
import UserHelpdesk from 'App/Models/UserHelpdesk';
import Database from '@ioc:Adonis/Lucid/Database';

export default class AccountsController {
    public async delete({ auth, response }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        await userData.delete();
        await auth.logout();
        return response.redirect('/login');
    }

    public async showMe({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);
        const name = userData?.name.split(' ');

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const helpdeskData = await UserHelpdesk.findBy('user_id', userData.id);
        const userPlanData = await UserPlan.findBy('user_id', userData.id);

        return view.render('dashboard/me', {
            helpdesk: helpdeskData,
            app_domain: Env.get('APP_DOMAIN'),
            user: userData,
            plan: userPlanData,
            name,
        });
    }

    public async updateHelpDesk({ view, auth, response, request, session }: HttpContextContract) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user?.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const name = userData.name.split(' ');
        const helpdeskData = await UserHelpdesk.findBy('user_id', userData.id);
        const userPlanData = await UserPlan.findBy('user_id', userData.id);

        if (!helpdeskData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const data = request.all();

        if (!data) {
            session.flash('notification', 'Você precisa informar todos os dados!');
            return response.redirect('back');
        }

        if (data.enterprise_name.length > 16) {
            session.flash('notification', 'Nome da empresa é até 16 caracteres!');
            return response.redirect('back');
        }

        helpdeskData.address = data.address;
        helpdeskData.own_domain = data.own_domain;
        helpdeskData.enterprise_name = data.enterprise_name;

        await helpdeskData.save();

        return view.render('dashboard/me', {
            helpdesk: helpdeskData,
            app_domain: Env.get('APP_DOMAIN'),
            user: userData,
            plan: userPlanData,
            name,
        });
    }
}
