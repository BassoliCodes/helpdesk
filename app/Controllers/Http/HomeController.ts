import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class HomeController {
    public async showIndex({ view }) {
        return view.render('home');
    }
}
