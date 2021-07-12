import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DomainsController {
    public async showIndex({ view, subdomains }: HttpContextContract) {
        const subdomain = await subdomains.address;

        console.log(subdomain);

        return view.render('helpdesk/index');
    }
}
