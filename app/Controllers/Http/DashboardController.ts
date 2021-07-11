import User from 'App/Models/User';
import UserPlan from 'App/Models/UserPlan';

export default class DashboardController {
    public async showIndex({ view, auth, response }) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user.email);

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
}
