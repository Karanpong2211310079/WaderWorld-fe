import { Component, inject, OnDestroy, OnInit, Inject } from '@angular/core';

import { Type } from '@angular/core';
import { NgModalServiceService } from '../../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-profile',
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  constructor(@Inject('modalEl') public modalEl: NgbModalRef) {}
  private modalService = inject(NgModalServiceService);

  public saveProfile() {
    this.modalService.dismissModal(this.modalEl, 'save');
  }
}
