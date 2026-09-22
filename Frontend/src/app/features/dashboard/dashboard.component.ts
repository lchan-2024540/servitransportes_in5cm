import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ENTIDADES } from '../../core/config/entidades.config';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    // solo se muestran las secciones que el rol actual puede ver
    entidades: typeof ENTIDADES;

    constructor(public authService: AuthService) {
        this.entidades = ENTIDADES.filter((entidad) => this.authService.puedeVer(entidad));
    }
}
