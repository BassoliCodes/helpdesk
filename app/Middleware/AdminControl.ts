import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AdminControl {
    public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
        await auth.use('web').authenticate();

        //Check if the user is an administrator
        if (!auth.user?.admin) {
            return response.redirect('/dashboard');
        }

        await next();
    }
}
