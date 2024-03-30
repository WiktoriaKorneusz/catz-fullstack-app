import { Component, HostListener, ViewChild } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { PostsService } from '../../_services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../_models/user';
import { take } from 'rxjs';
import { Post } from '../../_models/post';
import { PostDisplay } from '../../_models/postDisplay';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css',
})
export class PostEditComponent {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  currentUser: User | null = null;
  post: PostDisplay | null = null;

  constructor(
    private accountService: AccountService,
    private postsService: PostsService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
    });
  }

  ngOnInit() {
    this.loadPost();
  }

  loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    //turning string id into number
    this.postsService.getPost(+id).subscribe({
      next: (post) => {
        this.post = post;
        // this.getPhotos();
        this.checkAuthorship();
        console.log(this.post);
      },
      error: (err) => console.log(err),
    });
  }

  checkAuthorship() {
    if (this.currentUser?.username !== this.post?.userName) {
      this.router.navigateByUrl('/');
      this.toastr.error('You are not authorized to edit this post.');
    }
  }

  updatePost() {
    console.log(this.post);
    const id = this.post?.id;
    if (!id) return;
    //turning string id into number
    this.postsService.updatePost(id, this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Post updated successfully.');
        this.editForm?.reset(this.post);
      },
      error: (err) => console.log(err),
    });
  }
}
