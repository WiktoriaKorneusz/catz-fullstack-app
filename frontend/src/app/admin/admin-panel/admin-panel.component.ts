import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModeratePostsComponent } from '../moderate-posts/moderate-posts.component';
import { ModerateUsersComponent } from '../moderate-users/moderate-users.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule, ModeratePostsComponent, ModerateUsersComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  content: string = 'Posts';
}
