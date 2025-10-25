import { Component, inject } from '@angular/core';
import { PostComponent } from '../../../../shared/components/post/post.component';
import { RouterOutlet } from '@angular/router';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
@Component({
  selector: 'app-profile',
  imports: [PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private modalService = inject(NgModalServiceService);

  openEditProfile() {
    this.modalService.openTemplateModal(
      'Edit Profile',
      {
        autoCloseRoutingChange: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: false,
      },
      {
        componentRef: EditProfileComponent,
        value: '',
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
}
