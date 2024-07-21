import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { PostsService } from '../../_services/posts.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostDisplay } from '../../_models/postDisplay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post-add',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './post-add.component.html',
  styleUrl: './post-add.component.css',
})
export class PostAddComponent {
  private accountService = inject(AccountService);
  private postsService = inject(PostsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faUserCircle = faUserCircle;

  @ViewChild('addForm') addForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.addForm?.dirty) {
      $event.returnValue = true;
    }
  }
  currentUser = this.accountService.currentUser();
  post: PostDisplay = {
    id: 0,
    mainPhotoUrl: '',
    userName: '',
    knownAs: '',
    pronouns: '',
    content: '',
    created: '',
    photos: [],
  };

  selectedFiles?: FileList;
  previews: string[] = [];

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 5) {
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

  addPost() {
    if (!this.selectedFiles) {
      this.toastr.error('No photos selected.');
      return;
    }
    if (this.selectedFiles.length > 5) {
      this.toastr.error("You can't add more than 5 photos.");
      return;
    }
    if (this.selectFiles.length == 0) {
      this.toastr.error('Please select a photo.');
      return;
    }
    if (this.post.content.trim().length == 0) {
      this.toastr.error('Post content cannot be empty.');
      return;
    }

    this.postsService.addPost(this.post, this.selectedFiles).subscribe({
      next: (_) => {
        this.toastr.success('Post added successfully.');
        this.router.navigateByUrl('/user');
      },
      error: (err) => {
        this.toastr.error("Couldn't add post. Please try again.");
        console.log(err);
      },
    });
  }
}
