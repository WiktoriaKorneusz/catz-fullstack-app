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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css',
})
export class PostEditComponent {
  //FontAwesome
  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faUserCircle = faUserCircle;

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
  //for uploader
  isPhotoUploaderOpen = false;
  currentFile?: File;
  preview = '';

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
    this.closePhotoUploader();
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

  uploadPhoto() {
    if (this.post?.photos != undefined && this.post?.photos.length >= 5) {
      this.toastr.error("You can't add more than 5 photos.");
      return;
    }
    if (!this.currentFile) {
      this.toastr.error('Please select a photo.');
      return;
    }

    const id = this.post?.id;
    if (!id) return;

    console.log(this.currentFile);
    this.postsService.addPhoto(id, this.currentFile).subscribe({
      next: (_) => {
        this.toastr.success('Photo added successfully.');
        this.loadPost();
      },
      error: (err) => {
        this.toastr.error("Couldn't add photo. Please try again.");
        console.log(err);
      },
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

    this.postsService.setMainPhoto(postId, id).subscribe({
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
  selectFile(event: any): void {
    this.preview = '';
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  openPhotoUploader() {
    if (this.post?.photos !== undefined && this.post?.photos.length < 5)
      this.isPhotoUploaderOpen = true;
    else this.toastr.error("You can't add more than 5 photos.");
  }
  closePhotoUploader() {
    this.isPhotoUploaderOpen = false;
  }
}
