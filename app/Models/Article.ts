import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Article extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public userId: number;

    @column()
    public categoryId: number;

    @column()
    public name: string;

    @column()
    public description: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
