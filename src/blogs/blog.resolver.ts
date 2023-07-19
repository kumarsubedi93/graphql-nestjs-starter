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