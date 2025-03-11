import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HidePopoverDirective } from './hide-popover.directive';
@NgModule({
  declarations: [HidePopoverDirective],
  imports: [CommonModule],
  exports: [HidePopoverDirective]
})
export class HidePopoverModule {}
