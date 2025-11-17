import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router, RouterOutlet } from '@angular/router'; // <== เพิ่มตรงนี้
import { AuthenticationServiceService } from '../../../../core/service/authentication-service/authentication-service.service';
import { RestApiService } from '../../../../core/service/rest-api-service/rest-api.service';
import { NgModalServiceService } from '../../../../core/service/ng-modal-service/ng-modal-service.service';
import { ToastService } from '../../../../core/service/toast-service/toast.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnDestroy, OnInit {
  private router = inject(Router);
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private modalService = inject(NgModalServiceService);
  private toast = inject(ToastService);
  private unsubscribe$ = new Subject<void>();
  public userImage: any;
  public user: any;
  public searchform = new FormGroup({ username: new FormControl('') });
  public userMenuOpen = false;

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  ngOnInit(): void {
    // ค้นหา user ตอนพิมพ์
    this.searchform
      .get('username')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: string | null) => {
        this.search_user(value || ''); // ถ้า null ให้เป็น ''
      });
    this.authen.getProfile().subscribe((imgUrl) => {
      console.log('Profile image:', imgUrl);
      this.userImage = imgUrl; // เก็บไว้ใช้ใน template
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public Logout_btn() {
    this.authen.logout(); // เคลียร์ token, cookie, session ทั้งหมด

    this.toast.success('Logout สำเร็จ');
    this.router.navigate(['/auth/login']);
  }

  public search_user(username: string) {
    const payload = { username: username || '' };
    this.restapi
      .post('friends/search_user/', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.user = response.message; // เก็บ array ของ user
        console.log(this.user);
      });
  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  selectUser(user: any) {
    this.router.navigate(['/workspace/profile/', user.id]);
  }

  public navigateToProfile() {
    this.router.navigate(['/workspace/profile']);
  }
  public navigateToDashboard() {
    this.router.navigate(['admin']);
  }
  public navigateToHome() {
    this.router.navigate(['/workspace/home']);
  }
}
