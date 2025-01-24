import { Component } from '@angular/core';
import { ButtonDirective,ImgModule,FormModule  } from '@coreui/angular';
@Component({
  selector: 'app-login',
  imports: [ButtonDirective,ImgModule,FormModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}