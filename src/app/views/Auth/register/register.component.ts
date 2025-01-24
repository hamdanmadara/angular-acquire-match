import { Component } from '@angular/core';
import { ButtonDirective, ImgModule, FormModule } from '@coreui/angular';
@Component({
  selector: 'app-register',
  imports: [ButtonDirective, ImgModule, FormModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}

