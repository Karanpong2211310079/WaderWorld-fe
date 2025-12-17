import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestApiService } from '../../../../../core/service/rest-api-service/rest-api.service';
import { AuthenticationServiceService } from '../../../../../core/service/authentication-service/authentication-service.service';
import { NgModalServiceService } from '../../../../../core/service/ng-modal-service/ng-modal-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../core/service/toast-service/toast.service';

export interface Group {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  type: 'PUBLIC' | 'PRIVATE';
  category: string; // เพิ่ม category field
}

@Component({
  selector: 'app-edit-group',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
})
export class EditGroupComponent implements OnInit {
  private restapi = inject(RestApiService);
  private authen = inject(AuthenticationServiceService);
  private modalService = inject(NgModalServiceService);
  private toast = inject(ToastService);

  editgroupform: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  currentGroup: Group;
  selectedFile: File | null = null;
  removeImage = false;

  constructor(
    @Inject('modalEl') public modalEl: NgbModalRef,
    @Inject('value') public value: any,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.currentGroup = this.value.value.user_data || null;

    // Initialize form with category field
    this.editgroupform = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: [null],
      type: ['PUBLIC', Validators.required],
      category: ['BEACH', Validators.required], // เพิ่ม category field
    });
  }

  ngOnInit(): void {
    if (this.currentGroup) {
      this.editgroupform.patchValue({
        name: this.currentGroup.name || '',
        description: this.currentGroup.description || '',
        image: this.currentGroup.image_url,
        type: this.currentGroup.type || 'PUBLIC',
        category: this.currentGroup.category || 'BEACH', // เพิ่ม category
      });
    }
    console.log('Editing Group:', this.currentGroup);
  }

  // Handle image selection
  onImageSelected(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('File size must be less than 5MB');
        return;
      }

      this.selectedFile = file;
      this.editgroupform.patchValue({ image: file });
      this.removeImage = false;

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  // Remove current image
  removeCurrentImage() {
    this.removeImage = true;
    this.imagePreview = null;
    this.selectedFile = null;
    this.editgroupform.patchValue({ image: null });
  }

  // Remove newly selected image
  removeNewImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.removeImage = false;
    this.editgroupform.patchValue({ image: null });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Submit form to API
  submitForm() {
    if (this.editgroupform.invalid) {
      this.toast.error('Please fill in all required fields');
      return;
    }

    if (!this.currentGroup?.id) {
      this.toast.error('Group ID is missing');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('group_id', this.currentGroup.id.toString());

    const formValue = this.editgroupform.value;

    // Only append changed fields
    if (formValue.name !== this.currentGroup.name) {
      formData.append('name', formValue.name || '');
    }

    if (formValue.description !== this.currentGroup.description) {
      formData.append('description', formValue.description || '');
    }

    if (formValue.type !== this.currentGroup.type) {
      formData.append('type', formValue.type);
    }

    // เพิ่มการตรวจสอบ category
    if (formValue.category !== this.currentGroup.category) {
      formData.append('category', formValue.category);
    }

    // Handle image
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.removeImage) {
      formData.append('image', '');
    }

    console.log('Submitting Edit Form Data:', {
      group_id: this.currentGroup.id,
      name: formValue.name,
      description: formValue.description,
      type: formValue.type,
      category: formValue.category, // เพิ่ม category ใน log
      hasNewImage: !!this.selectedFile,
      removeImage: this.removeImage,
    });

    this.restapi.post('admin/update_group/', formData).subscribe({
      next: (res) => {
        console.log('Group updated successfully:', res);
        this.toast.success('Group updated successfully!');
        this.modalService.dismissModal(this.modalEl, {
          action: 'save',
          updatedGroup: res.group,
        });
      },
      error: (err) => {
        console.error('Error updating group:', err);
        let errorMessage = 'Failed to update group';

        if (err.error && typeof err.error === 'object') {
          const errors = Object.values(err.error).flat();
          errorMessage = errors.join(', ');
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        }

        this.toast.error(errorMessage);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  // Cancel edit
  public CancelEditGroup() {
    this.modalService.dismissModal(this.modalEl, {
      action: 'cancel',
    });
  }

  // Helper method to check if form has changes
  hasChanges(): boolean {
    if (!this.currentGroup) return false;

    const formValue = this.editgroupform.value;

    return (
      formValue.name !== this.currentGroup.name ||
      formValue.description !== this.currentGroup.description ||
      formValue.type !== this.currentGroup.type ||
      formValue.category !== this.currentGroup.category || // เพิ่ม category check
      this.selectedFile !== null ||
      this.removeImage
    );
  }

  // Method สำหรับกำหนด CSS class ของ badge
  getCategoryBadgeClass(category: string): string {
    const categoryClasses: { [key: string]: string } = {
      BEACH: 'bg-info text-white',
      MOUNTAIN: 'bg-success text-white',
      FOREST: 'bg-dark text-white',
      TOURIST_SPOT: 'bg-warning text-dark',
      CAMPING: 'bg-secondary text-white',
      TEMPLE_MERIT: 'bg-primary text-white',
      FOOD_CAFE: 'bg-danger text-white',
      THEME_WATER_PARK: 'bg-info text-white',
      ADVENTURE: 'bg-success text-white',
      NIGHTLIFE: 'bg-dark text-white',
      VOLUNTEERING: 'bg-primary text-white',
      PHOTOGRAPHY: 'bg-secondary text-white',
      CONCERT: 'bg-danger text-white',
      WATERFALL: 'bg-info text-white',
      CITY_TRIP: 'bg-warning text-dark',
      DIVING: 'bg-primary text-white',
      OTHER: 'bg-secondary text-white',
    };

    return categoryClasses[category] || 'bg-secondary text-white';
  }

  // Method สำหรับแสดงชื่อหมวดหมู่
  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      BEACH: '🏖️ Sea & Islands',
      MOUNTAIN: '⛰️ Mountains & Hills',
      FOREST: '🌳 Forest',
      TOURIST_SPOT: '📍 Tourist Spots',
      CAMPING: '🏕️ Camping',
      TEMPLE_MERIT: '🛕 Temples & Merit Making',
      FOOD_CAFE: '☕ Food & Cafes',
      THEME_WATER_PARK: '🎢 Theme & Water Parks',
      ADVENTURE: '🧗 Hiking & Adventure',
      NIGHTLIFE: '🍻 Nightlife & Party',
      VOLUNTEERING: '🤝 Volunteering',
      PHOTOGRAPHY: '📸 Photography',
      CONCERT: '🎤 Concerts',
      WATERFALL: '🏞️ Waterfalls & Nature',
      CITY_TRIP: '🏙️ City Sightseeing',
      DIVING: '🤿 Diving',
      OTHER: '❓ Other',
    };

    return categoryNames[category] || '❓ Other';
  }
}
