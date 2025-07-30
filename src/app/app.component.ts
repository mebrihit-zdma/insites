import { RouterOutlet,RouterModule} from '@angular/router';
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  constructor(
    private userService: UserService,
  ) { }
  ngOnInit(): void {
    this.userService.setUserName("Patty");
  }
}




