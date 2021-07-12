import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AdminsController {
    public async showIndex({ view }: HttpContextContract) {
        return view.render('admin/home');
    }
}
