import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([Post])],
  exports: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
