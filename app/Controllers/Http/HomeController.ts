import Env from '@ioc:Adonis/Core/Env';
import Database from '@ioc:Adonis/Lucid/Database';

export default class HomeController {
    public async showIndex({ view }) {
        const countUsers = await Database.from('users').count('*');

        const plans = {
            free: Env.get('PLAN_FREE'),
            starter: Env.get('PLAN_STARTER'),
            medium: Env.get('PLAN_MEDIUM'),
            enterprise: Env.get('PLAN_PROFISSIONAL'),
        };

        return view.render('home', { totalUsers: countUsers[0]['count(*)'], plans });
    }
}
