import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

    enteredTitle = '';
    enteredContent = '';
    isLoading = false;
    private mode = 'create';
    private postId: string;
    post: Post = { id: null, title: '', content: '', imagePath: null, creator: null};

    form: FormGroup;
    imagePreview: any;
    // @Output()
    // postCreated = new EventEmitter<Post>();

    constructor(public postsService: PostsService, public route: ActivatedRoute) {}

    ngOnInit() {
      this.form = new FormGroup({
        'title': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        'content': new FormControl(null, {
          validators: [Validators.required]
        }),
        'image': new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeTypeValidator]
        })
      });

      this.route.paramMap.subscribe((paramMap) => {
        if(paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.post = this.postsService.getPost(this.postId);
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
         this.imagePreview = reader.result;
       };

       reader.readAsDataURL(file);
    }

    onSavePost() {
      this.isLoading = true;
      const post: Post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: null,
        creator: null
      };

      if (this.mode === 'edit') {
          this.postsService.updatePost(this.postId, {
            title: this.form.value.title,
            content: this.form.value.content,
            image: this.form.value.image
          });
          console.log(this.form.value.image);


      } else {
          this.postsService.addPost(post, this.form.value.image);
      }

      this.form.reset();
      // this.postCreated.emit(post);
    }
}
