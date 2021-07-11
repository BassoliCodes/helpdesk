export default class DashboardController {
    public async showIndex({ view }) {
        return view.render('dashboard/home');
    }
}
