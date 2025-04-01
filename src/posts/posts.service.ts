import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  async createPost(req, dto: CreatePostDto) {
    const newPost = this.postRepo.create(dto);
    newPost.user = req.user.userId;

    try {
      await this.postRepo.save(newPost);
      return newPost;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll() {
    const posts = await this.postRepo.find({ relations: { user: true } });

    return posts.map((post) => {
      const { user, ...result } = post;

      return {
        ...result,
        userId: user.id,
      };
    });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new NotFoundException();
    }

    const { user, ...result } = post;

    return {
      ...result,
      userId: user.id,
    };
  }

  async editPost(req, id: number, dto: CreatePostDto) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (!(req.user.userId === post.user.id)) {
      throw new ForbiddenException();
    }

    const updatedPost = await this.postRepo.update(post, { ...dto });

    return updatedPost;
  }

  async deletePost(req, id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (!(req.user.userId === post.user.id)) {
      throw new ForbiddenException();
    }

    const deletedPost = await this.postRepo.delete(post);

    return deletedPost;
  }
}
