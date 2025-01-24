import { Component } from '@angular/core';
import { ButtonDirective, ImgModule, FormModule } from '@coreui/angular';
@Component({
  selector: 'app-create-organization',
  imports: [ButtonDirective, ImgModule, FormModule],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {

}
