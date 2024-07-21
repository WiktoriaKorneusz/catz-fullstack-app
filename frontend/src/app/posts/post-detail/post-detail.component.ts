import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { PostDisplay } from '../../_models/postDisplay';
import { PostsService } from '../../_services/posts.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostDetailComponent {
  private postsService = inject(PostsService);
  public accountsService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  isUserAuthor: boolean = false;
  post: PostDisplay | undefined;

  ngOnInit(): void {
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
    const currentUser = this.accountsService.currentUser();
    if (currentUser == null) return;
    this.isUserAuthor = currentUser.username === this.post?.userName;
  }
  deletePost() {
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
