import { Component, Input } from '@angular/core';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-post-add',
  standalone: true,
  imports: [],
  templateUrl: './post-add.component.html',
  styleUrl: './post-add.component.css',
})
export class PostAddComponent {
  @Input() member: Member | undefined;
}
