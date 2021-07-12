import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserHelpdesk from 'App/Models/UserHelpdesk';

export default class DomainsController {
    public async showIndex({ view }: HttpContextContract) {
        return view.render('helpdesk/index');
    }
}
