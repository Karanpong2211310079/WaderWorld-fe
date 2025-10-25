import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  CustomNgbModalOptions,
  TemplateModalOptionsModel,
} from '../../model/modal.model';
import { TemplateModalComponent } from '../../../shared/components/modal/template-modal/template-modal.component';
@Injectable({
  providedIn: 'root',
})
export class NgModalServiceService {
  private modalService = inject(NgbModal);
  private router = inject(Router);

  private unsubscribe$: Subject<void> = new Subject();
  private modals: NgbModalRef[] = [];
  constructor() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public startSubscriptionModals(): void {
    this.modalService.activeInstances
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((modals: NgbModalRef[]) => {
        this.modals = modals;
      });
  }
  public openModal(modal: {
    componentRef: any;
    id: string;
    options: CustomNgbModalOptions;
    value?: any;
  }): NgbModalRef {
    const modalEl = this.modalService.open(modal.componentRef, modal.options);
    if (modalEl) {
      const componentInstance = modalEl.componentInstance;
      componentInstance.modalID = modal.id;
      componentInstance.modalEl = modalEl;
      componentInstance.value = modal.value;
      if ('componentRef' in componentInstance) {
        componentInstance.componentRef = modal.value?.componentRef;
      }
      if ('title' in componentInstance) {
        componentInstance.title = modal.value?.title;
      }
      if ('subtitle' in componentInstance) {
        componentInstance.subtitle = modal.value?.subtitle;
      }
      if ('footer' in componentInstance) {
        componentInstance.footer = modal.value?.footer ?? true;
      }
      if (modal.options.autoCloseRoutingChange) {
        this.router.events
          .pipe(filter((x) => x instanceof NavigationEnd))
          .subscribe(() => {
            modalEl.dismiss();
          });
      }
    }
    return modalEl;
  }

  public openTemplateModal(
    id: string,
    options: CustomNgbModalOptions,
    value: TemplateModalOptionsModel
  ): NgbModalRef {
    const modalEl = this.openModal({
      componentRef: TemplateModalComponent,
      id: id,
      options: options,
      value: value,
    });
    return modalEl;
  }
  public closeModal(modalEl: NgbModalRef | undefined, value?: any): void {
    modalEl?.close(value ?? undefined);
  }

  public dismissModal(modalEl: NgbModalRef | undefined, value?: any): void {
    modalEl?.dismiss(value ?? undefined);
  }
}
