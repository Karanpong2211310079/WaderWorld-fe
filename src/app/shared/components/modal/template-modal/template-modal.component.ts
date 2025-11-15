import { CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnInit,
  Type,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TextModel } from '../../../../core/model/utilities.model';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
@Component({
  selector: 'app-template-modal',
  imports: [CommonModule],
  templateUrl: './template-modal.component.html',
  styleUrl: './template-modal.component.scss',
})
export class TemplateModalComponent {
  private modalService = inject(NgModalServiceService);

  @Input() componentRef!: Type<any>;
  @Input() value?: any;

  @Input() public title?: TextModel;
  @Input() public footer: boolean = true;
  @Input() public modalID?: string;
  @Input() public modalEl?: NgbModalRef;

  public headerClass?: string;

  public componentInjector!: Injector;

  private baseInjector = inject(Injector);

  ngOnInit(): void {
    this.initialSetting();
  }

  private initialSetting(): void {
    this.componentInjector = Injector.create({
      providers: [
        { provide: 'value', useValue: this.value },
        { provide: 'modalEl', useValue: this.modalEl },
      ],
      parent: this.baseInjector,
    });
    if (this.value) {
      this.headerClass = this.value.headerClass;
    }
  }

  public onClose(): void {
    this.modalService.closeModal(this.modalEl, this.value?.value);
  }

  public onDismiss(): void {
    this.modalService.dismissModal(this.modalEl);
  }
}
