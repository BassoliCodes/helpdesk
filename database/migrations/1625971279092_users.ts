import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
    protected tableName = 'users';

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id');
            table.string('name').notNullable();
            table.string('username').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.boolean('admin').defaultTo(0).notNullable();
            table.boolean('banned').defaultTo(0).notNullable();
            table.timestamps(true, true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
