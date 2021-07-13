import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserHelpdesk from 'App/Models/UserHelpdesk';

export default class DomainsController {
    public async showIndex({ view, params }: HttpContextContract) {
        const { helpdesk_address } = params;

        const checkHelpDeskByAddress = await UserHelpdesk.findBy('address', helpdesk_address);

        if (!checkHelpDeskByAddress) {
            return view.render('errors/not-found');
        }

        return view.render('helpdesk/index');
    }
}
