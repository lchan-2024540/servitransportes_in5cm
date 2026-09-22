import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// marca unica de la aplicacion: icono geometrico plano + nombre.
// se reutiliza en login, registro y la barra superior para mantener
// consistencia visual en toda la app.
@Component({
    selector: 'app-logo',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="app-logo" [class.app-logo--light]="light">
            <span class="app-logo__mark" [style.width.px]="size" [style.height.px]="size">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="10" [attr.fill]="light ? '#FFFFFF' : '#16233D'" />
                    <path
                        d="M10 30V17a1.4 1.4 0 0 1 1.4-1.4h13.2V30H10Z"
                        [attr.fill]="light ? '#16233D' : '#B8863E'"
                    />
                    <path
                        d="M24.6 22.4h6.6l5.4 6V30a1 1 0 0 1-1 1H24.6v-8.6Z"
                        [attr.fill]="light ? '#16233D' : '#FFFFFF'"
                        [attr.fill-opacity]="light ? 0.55 : 0.92"
                    />
                    <rect x="14" y="33" width="20" height="2" rx="1" [attr.fill]="light ? '#FFFFFF' : '#EEF2F6'" fill-opacity="0.85" />
                    <circle cx="18" cy="33" r="3.2" [attr.fill]="light ? '#16233D' : '#EEF2F6'" />
                    <circle cx="32" cy="33" r="3.2" [attr.fill]="light ? '#16233D' : '#EEF2F6'" />
                </svg>
            </span>
            @if (showText) {
                <span class="app-logo__text" [style.fontSize.px]="size * 0.5">ServiTransportes</span>
            }
        </div>
    `,
    styles: [`
        .app-logo { display: flex; align-items: center; gap: 10px; }
        .app-logo__mark { flex-shrink: 0; display: block; }
        .app-logo__mark svg { width: 100%; height: 100%; display: block; }
        .app-logo__text {
            font-family: 'Sora', sans-serif;
            font-weight: 700;
            color: var(--ink);
            letter-spacing: -0.01em;
            white-space: nowrap;
        }
        .app-logo--light .app-logo__text { color: #FFFFFF; }
    `],
})
export class LogoComponent {
    @Input() size = 36;
    @Input() showText = true;
    @Input() light = false;
}
