import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderByIdDesc' })
export class OrderByIdDescPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!value) return [];
    return value.sort((a, b) => b.id - a.id);
  }
}
