import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterModule],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
  }
}