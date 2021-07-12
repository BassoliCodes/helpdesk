import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Articles extends BaseSchema {
    protected tableName = 'articles';

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id');
            table
                .integer('user_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table
                .integer('category_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('categories')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('name').notNullable();
            table.text('description', 'longtext').notNullable();
            table.timestamps(true, true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
