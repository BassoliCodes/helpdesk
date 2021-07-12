import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { format } from 'date-fns';

export default class AdminsController {
    public async showIndex({ view }: HttpContextContract) {
        return view.render('admin/home');
    }

    public async showClients({ view }: HttpContextContract) {
        const usersData = await User.all();

        return view.render('admin/client', {
            listUsers: usersData,
        });
    }
}
