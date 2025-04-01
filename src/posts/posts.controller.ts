import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findPosts() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Req() req, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(req, dto);
  }

  @Get(':id')
  async findOnePost(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.editPost(req, +id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Req() req, @Param('id') id: string) {
    return this.postsService.deletePost(req, +id);
  }
}
