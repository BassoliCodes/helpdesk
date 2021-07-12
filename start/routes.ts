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

Route.group(() => {
    Route.get('/dashboard', 'DashboardController.showIndex');
    Route.get('/me', 'AccountsController.showMe');
    Route.get('/logout', 'AuthController.logout');
    Route.get('/account/delete', 'AccountsController.delete');
}).middleware(['auth']);

Route.group(() => {
    Route.get('/admin', 'AdminsController.showIndex');
}).middleware(['auth', 'adminControl']);
