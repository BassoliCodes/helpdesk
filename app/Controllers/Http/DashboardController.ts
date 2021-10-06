import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Category from 'App/Models/Category'
import Article from 'App/Models/Article'
import UserPlan from 'App/Models/UserPlan'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DashboardController {
    public async showIndex({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const planUser = await UserPlan.findBy('user_id', userData.id)

        if (!planUser) {
            await auth.logout()
            return response.redirect('/login')
        }

        const name = userData.name.split(' ')

        return view.render('dashboard/home', {
            user: userData,
            plan: planUser,
            name,
        })
    }

    public async showCategories({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const planUser = await UserPlan.findBy('user_id', userData.id)

        if (!planUser) {
            await auth.logout()
            return response.redirect('/login')
        }

        const categoriesData = await Database.rawQuery(
            'SELECT * FROM categories WHERE user_id = ?',
            [userData.id],
        )

        const name = userData.name.split(' ')

        return view.render('dashboard/categories/index', {
            categories: categoriesData[0],
            user: userData,
            plan: planUser,
            name,
        })
    }

    public async showAddCategories({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const planUser = await UserPlan.findBy('user_id', userData.id)

        if (!planUser) {
            await auth.logout()
            return response.redirect('/login')
        }

        const name = userData.name.split(' ')

        return view.render('dashboard/categories/add', {
            user: userData,
            plan: planUser,
            name,
        })
    }

    public async addCategories({ request, response, auth, session }: HttpContextContract) {
        await auth.use('web').authenticate()

        const { userId, name, description } = request.all()

        if (!userId || !name || !description) {
            session.flash('notification', 'Você precisa preencher todos os campos!')
            return response.redirect('back')
        }

        await Category.create({ userId, name, description })
        return response.redirect('/dashboard/categories')
    }

    public async deleteCategories({ request, response, auth }: HttpContextContract) {
        const { id } = request.params() as {
            id: number
        }

        if (!id) {
            await auth.logout()
            return response.redirect('/login')
        }

        const category = await Category.findBy('id', id)

        if (!category) {
            await auth.logout()
            return response.redirect('/login')
        }

        category.delete()
        return response.redirect('back')
    }

    public async showArticles({ view, auth, response }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const planUser = await UserPlan.findBy('user_id', userData.id)

        if (!planUser) {
            await auth.logout()
            return response.redirect('/login')
        }

        const articlesData = await Database.rawQuery('SELECT * FROM articles WHERE user_id = ?', [
            userData.id,
        ])

        const name = userData.name.split(' ')

        return view.render('dashboard/article/index', {
            articles: articlesData[0],
            user: userData,
            plan: planUser,
            name,
        })
    }

    public async showAddArticles({ auth, response, view }: HttpContextContract) {
        await auth.use('web').authenticate()

        const userData = await User.findBy('email', auth.user?.email)

        if (!userData) {
            await auth.logout()
            return response.redirect('/login')
        }

        const planUser = await UserPlan.findBy('user_id', userData.id)

        if (!planUser) {
            await auth.logout()
            return response.redirect('/login')
        }

        const allCategoryData = await Database.rawQuery(
            'SELECT * FROM 	categories WHERE user_id = ?',
            [userData.id],
        )

        const name = userData.name.split(' ')

        return view.render('dashboard/article/add', {
            categories: allCategoryData[0],
            user: userData,
            plan: planUser,
            name,
        })
    }

    public async addArticles({ auth, request, response, session }: HttpContextContract) {
        await auth.use('web').authenticate()

        const { userId, categoryId, name, description } = request.body() as {
            userId: number
            categoryId: number
            name: string
            description: string
        }

        if (!userId || !categoryId || !name || !description) {
            session.flash('notification', 'Você precisa preencher todos os campos!')
            return response.redirect('back')
        }

        await Article.create({
            userId,
            categoryId,
            name,
            description,
        })
        return response.redirect('/dashboard/articles')
    }

    public async deleteArticles({ request, response, auth }: HttpContextContract) {
        const { id } = request.params() as {
            id: number
        }

        if (!id) {
            await auth.logout()
            return response.redirect('/login')
        }

        const category = await Article.findBy('id', id)

        if (!category) {
            await auth.logout()
            return response.redirect('/login')
        }

        category.delete()
        return response.redirect('back')
    }
}
