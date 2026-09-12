import { Component } from '@angular/core';
import { Header } from "./shared/header/header";
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from "../shared/footer/footer";
import { CategoriesMenu } from "./shared/categoriesmenu/categoriesmenu";
import { AuthService } from "../core/services/auth-service";

@Component({
  imports: [RouterOutlet, RouterLink, Header, Footer, CategoriesMenu],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  constructor(private _authService: AuthService) {}

  get userName(): string {
    return this._authService.returnFirstName();
  }
}
