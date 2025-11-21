// src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private defaultConfig: Partial<IndividualConfig> = {
    positionClass: 'toast-top-right',
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
  };

  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, { ...this.defaultConfig, ...config });
  }

  error(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.error(message, title, { ...this.defaultConfig, ...config });
  }

  info(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.info(message, title, { ...this.defaultConfig, ...config });
  }

  warning(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.warning(message, title, { ...this.defaultConfig, ...config });
  }
}
