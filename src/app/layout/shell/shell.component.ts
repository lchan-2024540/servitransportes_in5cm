import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ENTIDADES } from '../../core/config/entidades.config';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
})
export class ShellComponent {
    // solo se muestran en el menu las entidades que el rol actual puede ver
    entidades: typeof ENTIDADES;

    constructor(public authService: AuthService, private router: Router) {
        this.entidades = ENTIDADES.filter((entidad) => this.authService.puedeVer(entidad));
    }

    cerrarSesion(): void {
        this.authService.cerrarSesion();
        this.router.navigate(['/login']);
    }
}
