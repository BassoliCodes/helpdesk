import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class AdminsController {
    public async showIndex({ view, auth }: HttpContextContract) {
        await auth.use('web').authenticate()

        const countUsers = await Database.from('users').count('* as total')
        const userData = await User.findBy('email', auth.user?.email)

        const name = userData?.name.split(' ')

        return view.render('admin/home', {
            totalUsers: countUsers[0].total,
            user: userData,
            name,
        })
    }

    public async showClients({ view }: HttpContextContract) {
        const usersData = await User.all()

        return view.render('admin/client', {
            listUsers: usersData,
        })
    }

    public async deleteAccount({ auth, response, request }: HttpContextContract) {
        await auth.use('web').authenticate()

        const { accountId } = request.params() as {
            accountId: number
        }

        const userData = await User.findBy('id', accountId)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        await userData.delete()
        return response.redirect('back')
    }
}
