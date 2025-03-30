import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  async createPost(req, dto: CreatePostDto) {
    const newPost = this.postRepo.create(dto);
    newPost.userId = req.user.userId;

    try {
      await this.postRepo.save(newPost);
      return newPost;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll() {
    const posts = await this.postRepo.find({ relations: { userId: true } });

    return posts.map((post) => ({
      ...post,
      userId: post.userId.id,
    }));
  }
}
