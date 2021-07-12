import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Categories extends BaseSchema {
    protected tableName = 'categories';

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id');
            table
                .integer('user_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            table.string('name').notNullable();
            table.string('description').notNullable();
            table.timestamps(true, true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
