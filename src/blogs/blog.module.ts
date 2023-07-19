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