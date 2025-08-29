import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-insites-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insites-card.component.html',
  styleUrl: './insites-card.component.css'
})
export class InsitesCardComponent {
  @Input() data!: any; // Input property to receive data from the parent
  @Input() id!: any;
  @Input() title!: any;
  constructor( private router: Router ) {

  }

  viewMore(){
    this.router.navigate(['/dashboard-page/chat']);
  }

  openInsitesChat() {
    // Dispatch a custom event to open the chatbot
    window.dispatchEvent(new CustomEvent('openInsitesChat'));
  }
}
