import { InputType, Int, Field, ID } from '@nestjs/graphql'
@InputType()
export class CreateBlogInput {
    
    @Field(()=> ID, {description: 'blog id', nullable: true})
    id:number

    @Field({nullable: false})
    title:string

    @Field({nullable: false})
    tags: string

    @Field({nullable: true})
    description?:string

    @Field( { description: 'createdAt', nullable:true })
    createdAt: string;

    @Field( { description: 'updatedAt', nullable:true })
    updatedAt: string;

}