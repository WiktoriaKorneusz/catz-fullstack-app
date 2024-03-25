import { Component } from '@angular/core';
import { PostDisplay } from '../../_models/postDisplay';
import { PostsService } from '../../_services/posts.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, GalleryModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  post: PostDisplay | undefined;
  photos: GalleryItem[] = [];

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
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
          src: photo.url,
          thumb: photo.url,
        })
      );
    }
  }
}
