import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserPlans extends BaseSchema {
    protected tableName = 'user_plans';

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
            table.enum('plan', ['FREE', 'PRO']).notNullable().defaultTo('FREE');
            table.timestamps(true, true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
