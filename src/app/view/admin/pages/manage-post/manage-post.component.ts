import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FollowBtnComponent } from '../../../../shared/components/follow-btn/follow-btn.component';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { Subject, takeUntil } from 'rxjs';
import { PostDataModalComponent } from '../components/post-data-modal/post-data-modal.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-post',
  imports: [FollowBtnComponent, CommonModule],
  templateUrl: './manage-post.component.html',
  styleUrl: './manage-post.component.scss',
})
export class ManagePostComponent implements OnDestroy, OnInit {
  private toast = inject(ToastService);
  private modalService = inject(NgModalServiceService);
  private authen = inject(AuthenticationServiceService);

  private restApi = inject(RestApiService);
  private unsubscribe$ = new Subject<void>();
  public state: string = 'User';
  public User_state: string = 'User';
  public Group_state: string = 'Group';

  public UserAllPosts: any;
  public GroupAllPosts: any;

  public getUserAllPost() {
    this.restApi
      .get('admin/get_user_posts/')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.UserAllPosts = response.posts;
        console.log('data', this.UserAllPosts);
      });
  }
  public getGroupAllPost() {
    this.restApi
      .get('admin/get_group_posts/')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.GroupAllPosts = response.group_posts;
        console.log('data', this.GroupAllPosts);
      });
  }

  public deleteUserPost(post_id: number) {
    // 1. แสดง SweetAlert เพื่อขอการยืนยัน
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      // 2. ตรวจสอบว่าผู้ใช้กดปุ่ม 'Yes' (Confirm)
      if (result.isConfirmed) {
        const payload = {
          post_id: post_id,
        };
        console.log(payload);
        // 3. ถ้าผู้ใช้ยืนยัน ให้เรียก API ลบโพสต์
        this.restApi
          .post('admin/delete_user_post/', payload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (response) => {
              // 4. เมื่อลบสำเร็จ แสดง Toast และโหลดรายการใหม่
              this.toast.success(response.data.message); // ใช้ response.message.message ตามโค้ดเดิม
              console.log(response);
              this.getUserAllPost(); // Refresh list
            },
            (error) => {
              // (ทางเลือก) จัดการข้อผิดพลาด
              this.toast.error('Failed to delete user post.');
              console.error(error);
            }
          );
      }
    });
  }
  public deleteGroupPost(post_id: number) {
    // 1. แสดง SweetAlert เพื่อขอการยืนยัน
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      // 2. ตรวจสอบว่าผู้ใช้กดปุ่ม 'Yes' (Confirm)
      if (result.isConfirmed) {
        const payload = {
          group_post_id: post_id,
        };

        // 3. ถ้าผู้ใช้ยืนยัน ให้เรียก API ลบโพสต์
        this.restApi
          .post('admin/delete_group_post/', payload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (response) => {
              // 4. เมื่อลบสำเร็จ แสดง Toast และโหลดรายการใหม่
              this.toast.success(response.message);
              this.getGroupAllPost();

              // (ทางเลือก) แสดง Success Alert อีกครั้ง
              // Swal.fire(
              //   'Deleted!',
              //   'The post has been deleted.',
              //   'success'
              // )
            },
            (error) => {
              // (ทางเลือก) จัดการข้อผิดพลาด
              this.toast.error('Failed to delete post.');
            }
          );
      }
    });
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

  public inspect_grop_post(item: any) {
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
        componentRef: PostDataModalComponent,
        value: { group_data: item },
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }
  public inspect_user_post(item: any) {
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
        componentRef: PostDataModalComponent,
        value: { user_data: item },
        title: {
          text: 'PAGE.WORKSPACE.SETTINGS.UPDATE_ROLEPERMISSION.TITLE',
        },
        footer: false,
        headerClass: 'bg-danger',
      }
    );
  }

  onChoiceChanged(newChoice: string) {
    this.state = newChoice;
  }
  ngOnInit(): void {
    console.log(this.getUserAllPost());
    console.log(this.getGroupAllPost());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
