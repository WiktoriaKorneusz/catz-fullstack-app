import { Component } from '@angular/core';
import { PostDisplay } from '../../_models/postDisplay';
import { PostsService } from '../../_services/posts.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, GalleryModule, FontAwesomeModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  isUserAuthor: boolean = false;
  post: PostDisplay | undefined;
  photos: GalleryItem[] = [];

  constructor(
    private postsService: PostsService,
    private accountsService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    //turning string id into number
    this.postsService.getPost(+id).subscribe({
      next: (post) => {
        this.post = post;
        this.getPhotos();
        this.checkAuthorship();
        console.log(this.post);
      },
      error: (err) => console.log(err),
    });
  }

  getPhotos() {
    if (!this.post) return;
    for (const photo of this.post?.photos) {
      this.photos.push(
        new ImageItem({
          src: 'https://res.cloudinary.com/wkorneusz/image/upload/' + photo.url,
          thumb:
            'https://res.cloudinary.com/wkorneusz/image/upload/' + photo.url,
        })
      );
    }
  }

  checkAuthorship() {
    this.accountsService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.isUserAuthor = user?.username === this.post?.userName;
        console.log(this.isUserAuthor);
      },
    });
  }
  deletePost() {
    console.log(this.post);
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.postsService.deletePost(+id).subscribe({
      next: () => {
        this.router.navigateByUrl('/users/' + this.post?.userName);
      },
      error: (err) => console.log(err),
    });
  }
}
// this.accountsService.currentUser$?.pipe(
//   map((user) => {
//     this.isUserAuthor = user?.username === this.post?.userName;
//     console.log(this.isUserAuthor);
//   })
// );
