import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserPlan from 'App/Models/UserPlan'
import Env from '@ioc:Adonis/Core/Env'
import UserHelpdesk from 'App/Models/UserHelpdesk'

export default class AccountsController {
    public async delete({ auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        await userData.delete()
        await auth.logout()
        return response.redirect('/login')
    }

    public async showMe({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)
        const name = userData?.name.split(' ')

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const helpdeskData = await UserHelpdesk.findBy('user_id', userData.id)
        const userPlanData = await UserPlan.findBy('user_id', userData.id)

        return view.render('dashboard/me', {
            helpdesk: helpdeskData,
            app_domain: Env.get('APP_DOMAIN'),
            user: userData,
            plan: userPlanData,
            plan_value: Env.get('PLAN_PRICE'),
            name,
        })
    }

    public async updateHelpDesk({ auth, response, request, session }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const helpdeskData = await UserHelpdesk.findBy('user_id', userData.id)

        if (!helpdeskData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const data = request.all()

        if (!data) {
            session.flash('error', 'Você precisa informar todos os dados!')
            return response.redirect('back')
        }

        if (data.enterprise_name.length > 35) {
            session.flash('error', 'Nome da empresa é até 35 caracteres!')
            return response.redirect('back')
        }

        helpdeskData.address = data.address
        helpdeskData.own_domain = data.own_domain
        helpdeskData.enterprise_name = data.enterprise_name

        await helpdeskData.save()

        session.flash('success', 'Os dados foram atualizados com sucesso!')
        return response.redirect('back')
    }
}
