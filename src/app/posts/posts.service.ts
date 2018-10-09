import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http.get<{message: string, posts: any, totalPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
           posts:  postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          totalPosts: postData.totalPosts
        };
      }))
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: data.totalPosts});
      });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", image, post.title); // 3rd arg is the filename
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/']);
      });
   }

   deletePost(id: string) {
      return  this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`);
    }

  updatePost(id: string, updateData: {title: string, content: string, image: File | string}) {

    let postData;
    if (typeof updateData.image === 'object') {
      postData = new FormData();
      postData.append("title", updateData.title);
      postData.append("content", updateData.content);
      postData.append("image", updateData.image, updateData.title); // 3rd arg is the filename
      console.log('postdata', postData);
    } else {
      postData = {
        title: updateData.title,
        content: updateData.content,
        imagePath: updateData.image
      };

    }

    this.http.patch<{message: string, doc: any}>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((res) => {
        // const oldPosts = [...this.posts];
        // const oldPostIndex = oldPosts.findIndex((p) => p.id === id);
        // oldPosts[oldPostIndex] = {
        //   id: id,
        //   title: res.doc.title,
        //   content: res.doc.content,
        //   imagePath: res.doc.imagePath
        // };
        // this.posts = oldPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return {...this.posts.find((p) =>  p.id === id )};
  }

}
