import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DomainsController {
    public async showIndex({ view }: HttpContextContract) {
        return view.render('helpdesk/index');
    }
}
