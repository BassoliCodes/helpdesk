import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AdminControl {
    public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
        if (auth.user?.admin == true || auth.user?.admin) {
            await next();
        }

        return response.redirect('/dashboard');
    }
}
