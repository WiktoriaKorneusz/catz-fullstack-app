import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { PostsService } from '../../_services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostDisplay } from '../../_models/postDisplay';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css',
})
export class PostEditComponent {
  private accountService = inject(AccountService);
  private postsService = inject(PostsService);
  private membersService = inject(MembersService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faUserCircle = faUserCircle;

  @ViewChild('editForm') editForm: NgForm | undefined;

  currentUser = this.accountService.currentUser();
  post: PostDisplay | null = null;

  // isPhotoUploaderOpen = false;
  // currentFile?: File;
  // selectedFiles?: FileList | null;
  selectedFiles?: FileList;
  previews: string[] = [];

  ngOnInit() {
    this.loadPost();
  }

  loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.postsService.getPost(+id).subscribe({
      next: (post) => {
        this.post = post;
        this.checkAuthorship();
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

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    if (
      this.selectedFiles &&
      this.post?.photos &&
      this.selectedFiles.length + this.post?.photos.length > 5
    ) {
      this.toastr.error('Maximum 5 images are allowed');
      event.target.value = '';
      return;
    }
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  updatePost() {
    const id = this.post?.id;
    if (!id) return;
    if (!this.editForm?.valid) return;
    this.postsService
      .updatePost(this.editForm?.value, this.selectedFiles ?? null, id)
      .subscribe({
        next: (_) => {
          this.toastr.success('Post updated successfully.');
          this.router.navigateByUrl('/users/' + this.post?.userName);
        },
        error: (err) => console.log(err),
      });
  }

  deletePhoto(id: number) {
    const postId = this.post?.id;
    if (!postId) return;
    this.postsService.deletePhoto(postId, id).subscribe({
      next: (_) => {
        this.toastr.success('Photo deleted successfully.');
        this.loadPost();
      },
      error: (err) => {
        this.toastr.error("Couldn't delete photo. Please try again.");
        console.log(err);
      },
    });
  }

  setMainPhoto(id: number) {
    const postId = this.post?.id;
    if (!postId) return;

    this.membersService.setMainPhoto(postId, id).subscribe({
      next: (_) => {
        this.toastr.success('Main photo changed successfully.');
        this.loadPost();
      },
      error: (err) => {
        this.toastr.error("Couldn't change main photo. Please try again.");
        console.log(err);
      },
    });
  }

  //image preview by BezKoder
  // selectFile(event: any): void {
  //   this.preview = '';
  //   const selectedFiles = event.target.files;

  //   if (selectedFiles) {
  //     const file: File | null = selectedFiles.item(0);

  //     if (file) {
  //       this.preview = '';
  //       this.currentFile = file;

  //       const reader = new FileReader();

  //       reader.onload = (e: any) => {
  //         this.preview = e.target.result;
  //       };

  //       reader.readAsDataURL(this.currentFile);
  //     }
  //   }
  // }

  // openPhotoUploader() {
  //   if (this.post?.photos !== undefined && this.post?.photos.length < 5)
  //     this.isPhotoUploaderOpen = true;
  //   else this.toastr.error("You can't add more than 5 photos.");
  // }
  // closePhotoUploader() {
  //   this.isPhotoUploaderOpen = false;
  // }
}
