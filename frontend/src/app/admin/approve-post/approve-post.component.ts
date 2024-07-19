import {
  Component,
  OnInit,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostDisplay } from '../../_models/postDisplay';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminService } from '../../_services/admin.service';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-post',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './approve-post.component.html',
  styleUrl: './approve-post.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovePostComponent implements OnInit {
  adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  id = Number(this.route.snapshot.paramMap.get('id'));
  post: PostDisplay | undefined;
  faCheck = faCheck;
  faX = faX;

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.adminService.getPost(this.id).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (err) => console.log(err),
    });
  }

  approvePost() {
    this.adminService.approvePost(this.id).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/admin');
      },
      error: (err) => console.log(err),
    });
  }
  disapprovePost() {
    this.adminService.disapprovePost(this.id).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/admin');
      },
      error: (err) => console.log(err),
    });
  }
}
