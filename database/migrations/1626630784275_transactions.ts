import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Transactions extends BaseSchema {
    protected tableName = 'transactions';

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
            table.string('payment_method').notNullable();
            table.string('payment_description').notNullable();
            table.decimal('price', 10, 2).notNullable();
            table.timestamps(true, true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
