import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserHelpdesk from 'App/Models/UserHelpdesk';

export default class DomainsController {
    public async showIndex({ view, params }: HttpContextContract) {
        const { address } = params;

        const checkHelpDeskByAddress = await UserHelpdesk.findBy('address', address);

        if (!checkHelpDeskByAddress) {
            return view.render('errors/not-found');
        }

        return view.render('helpdesk/index', { helpdeskData: checkHelpDeskByAddress });
    }
}
