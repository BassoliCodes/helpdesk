import User from 'App/Models/User';
import UserPlan from 'App/Models/UserPlan';

export default class AccountsController {
    public async delete({ auth, response }) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user.email);

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        await userData.delete();
        await auth.logout();
        return response.redirect('/login');
    }

    public async showMe({ view, auth, response }) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user.email);
        const name = userData?.name.split(' ');

        if (!userData) {
            await auth.logout();
            return response.redirect('/login');
        }

        const userPlanData = await UserPlan.findBy('user_id', userData.id);

        return view.render('dashboard/me', {
            user: userData,
            plan: userPlanData,
            name,
        });
    }
}
