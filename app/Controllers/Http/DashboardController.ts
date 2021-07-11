import User from 'App/Models/User';

export default class DashboardController {
    public async showIndex({ view }) {
        return view.render('dashboard/home');
    }

    public async showMe({ view, auth }) {
        await auth.use('web').authenticate();

        const userData = await User.findBy('email', auth.user.email);
        const name = userData?.name.split(' ');

        return view.render('dashboard/me', {
            user: userData,
            name,
        });
    }
}
