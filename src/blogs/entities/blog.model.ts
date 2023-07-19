import { Field, ObjectType, ID, Directive } from '@nestjs/graphql'
import { Table, Column, Model, PrimaryKey, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript'


@Table({tableName: 'blogs'})
@ObjectType()
@Directive('@key(fields: "id")')
export class Blog  extends Model{

    @Column({primaryKey:true, allowNull: false, autoIncrement:true})
    @Field(()=> ID, {description: 'blog id'})
    id: number

    @Column
    @Field({nullable : false, description: 'Title'})
    title: string

    @Column
    @Field({nullable: false})
    tags: string

    @Column
    @Field({ nullable: true})
    description?: string

    @Field()
    @CreatedAt public createdAt: Date

    @Field()
    @UpdatedAt public updatedAt: Date

}