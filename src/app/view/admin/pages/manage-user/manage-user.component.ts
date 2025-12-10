import { Component, OnDestroy, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { UserDataModalComponent } from '../components/user-data-modal/user-data-modal.component';
import Swal from 'sweetalert2'; // ตรวจสอบว่าได้ import Swal แล้ว
@Component({
  selector: 'app-manage-user',
  imports: [],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss',
})
export class ManageUserComponent implements OnDestroy, OnInit {
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);
  private authen = inject(AuthenticationServiceService);

  private restApi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();

  public AllUsers: any[] = [];

  ngOnInit(): void {
    this.getAllUsers();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  public calculation_time(timestamp: string): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  public getAllUsers() {
    this.restApi
      .get('admin/get_users/')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.AllUsers = response.users;
        console.log('All Users Data:', this.AllUsers);
      });
  }
  public delete_user(user_id: number) {
    // 1. แสดง SweetAlert เพื่อขอการยืนยันการ Deactivate
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will deactivate the user. They will not be able to log in.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // ใช้สีแดงสำหรับ Deactivation/Deletion
      cancelButtonColor: '#6c757d', // สีเทาสำหรับ Cancel
      confirmButtonText: 'Yes, deactivate it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      // 2. ตรวจสอบว่าผู้ใช้กดปุ่ม 'Yes' (Confirm)
      if (result.isConfirmed) {
        const payload = {
          user_id: user_id,
          is_active: false, // ตั้งค่าให้ผู้ใช้ไม่ Active
        };

        // 3. ถ้าผู้ใช้ยืนยัน ให้เรียก API เพื่อ Deactivate
        this.restApi
          .post('admin/edit_user/', payload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (response) => {
              // 4. เมื่อ Deactivate สำเร็จ แสดง Toast และโหลดรายการใหม่
              this.toast.success('User deactivated successfully!');
              this.getAllUsers(); // Refresh list
            },
            error: (error) => {
              // (ทางเลือก) จัดการข้อผิดพลาด
              this.toast.error('Failed to deactivate user.');
              console.error(error);
            },
          });
      }
    });
  }

  openEditUserModal(item: any) {
    this.modalService
      .openTemplateModal(
        'Edit Profile',
        {
          autoCloseRoutingChange: true,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          scrollable: false,
        },
        {
          componentRef: UserDataModalComponent,
          value: item,
          title: {
            text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
          },
          footer: false,
          headerClass: 'bg-danger',
        }
      )
      .result.then(
        (result) => {
          // Modal ปิดด้วยการแก้ไขสำเร็จ
          if (result) {
            this.getAllUsers(); // รีเฟรชรายการผู้ใช้
          }
        },
        (reason) => {
          // Modal ปิดโดยไม่บันทึก (Cancel)
          console.log('Edit user modal dismissed:', reason);
        }
      );
  }
}
