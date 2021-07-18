import Env from '@ioc:Adonis/Core/Env';
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', 'HomeController.showIndex');

Route.get('/login', 'AuthController.showLogin');
Route.post('/login', 'AuthController.login');

Route.get('/register', 'AuthController.showRegister');
Route.post('/register', 'AuthController.register');

Route.get('/:address', 'DomainsController.showIndex').domain(`helpdesk.${Env.get('APP_DOMAIN')}`);
Route.get('/payment/success', 'PaymentsController.showSuccessPayment');
Route.get('/payment/search', 'PaymentsController.searchPayment');
Route.get('/payment/cancel', ({ view }) => {
    view.render('dashboard/payments/cancel');
});

Route.group(() => {
    Route.get('/dashboard', 'DashboardController.showIndex');
    Route.get('/dashboard/categories', 'DashboardController.showCategories');
    Route.get('/dashboard/categories/add', 'DashboardController.showAddCategories');
    Route.post('/dashboard/categories/add', 'DashboardController.addCategories');
    Route.get('/dashboard/categories/delete/:id', 'DashboardController.deleteCategories');
    Route.get('/dashboard/articles', 'DashboardController.showArticles');
    Route.get('/dashboard/articles/add', 'DashboardController.showAddArticles');
    Route.post('/dashboard/articles/add', 'DashboardController.addArticles');
    Route.get('/dashboard/articles/delete/:id', 'DashboardController.deleteArticles');
    Route.get('/me', 'AccountsController.showMe');
    Route.post('/me', 'AccountsController.updateHelpDesk');
    Route.get('/logout', 'AuthController.logout');
    Route.get('/account/delete', 'AccountsController.delete');
    Route.post('/checkout/plan', 'PaymentsController.createPayment');
}).middleware(['auth']);

Route.group(() => {
    Route.get('/admin', 'AdminsController.showIndex');
    Route.get('/admin/client', 'AdminsController.showClients');
    Route.get('/admin/delete/account/:accountId', 'AdminsController.deleteAccount');
}).middleware(['auth', 'adminControl']);
