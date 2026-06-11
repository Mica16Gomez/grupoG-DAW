import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [ButtonModule, RouterLink, RouterLinkActive]
})
export class Template {

    private readonly authStore: AuthStore = inject(AuthStore);

    cerrarSesion() {
        this.authStore.cerrarSesion();
    }



}