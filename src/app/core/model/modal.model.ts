import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TextModel } from './utilities.model';
import { Type } from '@angular/core';

export interface CustomNgbModalOptions extends NgbModalOptions {
  autoCloseRoutingChange?: boolean;
}

export interface TemplateModalOptionsModel {
  value: any;
  componentRef: Type<any>;
  title?: TextModel;
  footer?: boolean;
  headerClass?: string;
}
