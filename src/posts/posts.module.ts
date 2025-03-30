import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';

@Module({
  providers: [PostsService],
  // imports: [TypeOrmModule.forFeature([User, Post])],
  imports: [TypeOrmModule.forFeature([Post])],
  exports: [PostsService],
})
export class PostsModule {}
