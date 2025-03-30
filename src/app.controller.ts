import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PostsService } from './posts/posts.service';
import { CreatePostDto } from './posts/dto/create-post.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private postsService: PostsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  async findPosts() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  async createPost(@Req() req, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(req, dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }

  // Не работает с JWT
  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Req() req) {
    return req.logout();
  }
}
