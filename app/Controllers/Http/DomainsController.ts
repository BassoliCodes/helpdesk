import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DomainsController {
    public async showIndex({ view, subdomains, response }: HttpContextContract) {
        const domainComplete = await subdomains.address;
        const subdomain = domainComplete.split('.')[0];

        return view.render('helpdesk/index');
    }
}
