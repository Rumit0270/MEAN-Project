import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // @Input()
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    console.log('asdasd');
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener().subscribe((data: {posts: Post[], postCount: number}) => {
      this.posts = data.posts;
      this.totalPosts = data.postCount;
      this.isLoading = false;
    });
 }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }


  onDelete(postId: string) {
    const bool = confirm('Are you sure you want to delete the post?');
    this.isLoading = true;
    if (bool) {
      this.postsService.deletePost(postId).subscribe((res) => {
        console.log(res.message);
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
    }
 }

 onChangePage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
  console.log(pageData);

 }
}
