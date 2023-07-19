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