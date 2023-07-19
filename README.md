# GraphQL geteway boilerplate with Nestjs

Starter kit for building API gateway with GraphQL/Nest JS /MYSQL 

## Setup

You can run the code by installing dependencies with

``` bash
npm i
```

and running development environment

``` bash
npm run start:dev
```

GraphQL playground is then accesible at

[http://localhost:3000/graphql](http://localhost:3000/graphql)

## Technologies

* Node.js 18.16.0
* Apollo server
* Official graphql-js schema builder
* Nestjs
* Full TypeScript support
* Code first schema mode
* Automatically generate gql file (GraphQL schema)
* Eslint, Nodemon, Dotenv, Eslint, Prettier, Jest

## Quick Start start CRUD Example for blog posts

Create `src/blogs/entites/blog.model.ts` This model is base model for sequlize as well as graphQL 

```
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
```


After creating the model class 
create the data transfer object (DTO) class for query from graphQL API 
 `src/blog.dto.ts`

```
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
```


After DTO class, create graphQL Resolver for access the graphQL query/mutation from frontend or playground 
`src/blog.resolver.ts`

```
import { Args, Mutation, Query, Resolver, Int,  } from "@nestjs/graphql";
import { Blog } from "./entities/blog.model";
import { BlogService } from "./blog.service";
import { CreateBlogInput } from "./blog.dto";

@Resolver(()=> Blog)
export class BlogResolver {
    constructor(private readonly blogService: BlogService){}

    @Query(()=> [Blog], {name: 'blogs'})
    getBlogs() {
        return this.blogService.getBlogs()
    }

    @Query(()=> Blog, {name: 'blogById'})
    async getBlogById(@Args('id', {type: ()=> Int}) id: number) {
        return this.blogService.getBlogById(id)
    }

    @Mutation(() => Boolean)
    removeBlog(@Args('id', {type: () => Int}) id:number){
        return this.blogService.deleteBlog(id)
    }

    @Mutation(() => Blog)
    async createBlog(@Args('createBlogInput') createBlogInput: CreateBlogInput) {
        const res = await this.blogService.createBlog(createBlogInput) 
        return res
    }

    @Mutation(() => Blog)
    updateBlog(@Args('updateBlogInput') updateBlogInput: CreateBlogInput) {
        return this.blogService.updateBlog(updateBlogInput.id, updateBlogInput)
    }

}
```


Create Service class for quering the database for actual data. Here we use mysql database using sequelize ORM 
`src/blog.service.ts`
```
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './entities/blog.model';
import { CreateBlogInput } from './blog.dto';


@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog)
        private BlogModel: typeof Blog
    ) {}

    async getBlogs(): Promise <Blog[]> {
        return this.BlogModel.findAll()
    }

    async getBlogById(id: number): Promise <Blog> {
        return this.BlogModel.findOne({
            where: {id: id}
        })
    }

   async deleteBlog(id:number): Promise<number> {
        return await this.BlogModel.destroy({
            where:{
                id: id
            }
        })
    }

    async createBlog(blogInput: CreateBlogInput): Promise <Blog> {
       return this.BlogModel.create({ ...blogInput }) 
    }

    async updateBlog(id: number, blogInput:CreateBlogInput): Promise <Blog> {
        await this.BlogModel.update({...blogInput}, {
            where:{
                id: id
            }
        })
        return await this.getBlogById(id)
    }
}
```


Register Model, Service and Resolver classes to blog module for exposing the blogs module service to main app module  
`src/blog.module.ts`
```
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Blog } from "./entities/blog.model";
import { BlogResolver } from "./blog.resolver";
import { BlogService } from "./blog.service";

@Module({
    imports:[
        SequelizeModule.forFeature([Blog])
    ],
    providers: [BlogResolver, BlogService],
})
export class BlogModule {}
```


After successfully setting up the blog module register the blog module to main app module imports 

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'
import { join } from 'path'
import { Blog } from './blogs/entities/blog.model';
import { BlogModule } from './blogs/blog.module';
const { development } = require('../config/config')
const { dialect, ...DB_Config } = development

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      playground:true,
      installSubscriptionHandlers:true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      ...DB_Config,
      models: [Blog]
    }),
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

