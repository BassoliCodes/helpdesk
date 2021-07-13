import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import UserPlan from 'App/Models/UserPlan';
import Env from '@ioc:Adonis/Core/Env';
import UserHelpdesk from 'App/Models/UserHelpdesk';

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
}
