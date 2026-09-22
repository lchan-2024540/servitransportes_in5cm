import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EntidadService } from '../../../core/services/entidad.service';

// tesseract.js se carga por cdn en index.html (script global), no como paquete npm
declare const Tesseract: any;

interface ClienteOpcion {
    id: number;
    nombre: string;
    nit?: string;
}

// formulario especial para "orden de compra": a diferencia de las otras 10
// entidades (formulario plano generico), esta necesita una lista dinamica
// de items (material/servicio, cantidad, precio unitario) con un total
// calculado automaticamente. por eso tiene su propio componente en vez de
// usar EntidadFormularioComponent.
@Component({
    selector: 'app-orden-compra-formulario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './orden-compra-formulario.component.html',
    styleUrl: './orden-compra-formulario.component.scss',
})
export class OrdenCompraFormularioComponent implements OnInit {
    formulario: FormGroup;
    idEditando: number | null = null;

    cargando = false;
    guardando = false;
    mensajeError = '';

    // estado del escaner (ocr gratuito en el navegador, sin backend ni costo)
    escaneando = false;
    progresoEscaneo = 0;
    textoDetectado = '';
    clienteDetectado = '';

    private clientes: ClienteOpcion[] = [];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private entidadService: EntidadService,
    ) {
        this.formulario = this.fb.group({
            cliente_id: [null, Validators.required],
            nit: ['', Validators.required],
            fecha: [''],
            items: this.fb.array([this.crearItem()]),
        });
    }

    get items(): FormArray {
        return this.formulario.get('items') as FormArray;
    }

    get esEdicion(): boolean {
        return this.idEditando !== null;
    }

    ngOnInit(): void {
        // se cargan los clientes una vez, para que el escaner pueda intentar
        // reconocer cual de ellos aparece mencionado en la imagen escaneada
        this.entidadService.listar<ClienteOpcion>('clientes').subscribe({
            next: (datos) => (this.clientes = datos),
            error: () => {},
        });

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.idEditando = Number(idParam);
            this.cargarRegistro(this.idEditando);
        }
    }

    private crearItem(valores?: { descripcion_servicio?: string; cantidad?: number; precio_unitario?: number }) {
        return this.fb.group({
            descripcion_servicio: [valores?.descripcion_servicio ?? '', Validators.required],
            cantidad: [valores?.cantidad ?? null, [Validators.required, Validators.min(0.01)]],
            precio_unitario: [valores?.precio_unitario ?? null, [Validators.required, Validators.min(0.01)]],
        });
    }

    agregarItem(): void {
        this.items.push(this.crearItem());
    }

    quitarItem(indice: number): void {
        if (this.items.length > 1) {
            this.items.removeAt(indice);
        }
    }

    // subtotal en vivo de un item (cantidad x precio unitario)
    subtotal(indice: number): number {
        const item = this.items.at(indice).getRawValue();
        const cantidad = Number(item.cantidad) || 0;
        const precio = Number(item.precio_unitario) || 0;
        return cantidad * precio;
    }

    // total en vivo de toda la orden (suma de subtotales)
    get total(): number {
        return this.items.controls.reduce((suma, _, i) => suma + this.subtotal(i), 0);
    }

    private cargarRegistro(id: number): void {
        this.cargando = true;
        this.entidadService.obtener<any>('ordenes-compra', id).subscribe({
            next: (registro) => {
                this.formulario.patchValue({
                    cliente_id: registro.cliente_id,
                    nit: registro.nit,
                    fecha: registro.fecha ? String(registro.fecha).substring(0, 10) : '',
                });

                this.items.clear();
                const itemsRegistro = Array.isArray(registro.items) ? registro.items : [];
                for (const item of itemsRegistro) {
                    this.items.push(this.crearItem(item));
                }
                if (this.items.length === 0) {
                    this.items.push(this.crearItem());
                }

                this.cargando = false;
            },
            error: (error) => {
                this.mensajeError = error?.error?.error || 'No se pudo cargar la orden de compra.';
                this.cargando = false;
            },
        });
    }

    // ================== escaner de la orden de compra (ocr gratuito) ==================
    async escanear(evento: Event): Promise<void> {
        const input = evento.target as HTMLInputElement;
        const archivo = input.files?.[0];
        if (!archivo) return;

        this.escaneando = true;
        this.progresoEscaneo = 0;
        this.textoDetectado = '';
        this.clienteDetectado = '';
        this.mensajeError = '';

        try {
            const resultado = await Tesseract.recognize(archivo, 'spa', {
                logger: (info: any) => {
                    if (info.status === 'recognizing text') {
                        this.progresoEscaneo = Math.round((info.progress || 0) * 100);
                    }
                },
            });

            const texto: string = resultado?.data?.text || '';
            this.textoDetectado = texto.trim();
            this.aplicarTextoDetectado(this.textoDetectado);
        } catch {
            this.mensajeError = 'No se pudo leer la imagen. Intenta con una foto más nítida.';
        } finally {
            this.escaneando = false;
            input.value = '';
        }
    }

    private aplicarTextoDetectado(texto: string): void {
        if (!texto) return;

        // busca un patron de nit guatemalteco (digitos, opcionalmente con guion y digito/k verificador)
        const coincidenciaNit = texto.match(/\b\d{4,9}-?[\dkK]\b/);
        if (coincidenciaNit) {
            this.formulario.patchValue({ nit: coincidenciaNit[0] });
        }

        // busca si el nombre de algun cliente ya registrado aparece mencionado en el texto
        const textoNormalizado = texto.toLowerCase();
        const clienteEncontrado = this.clientes.find((c) =>
            c.nombre && textoNormalizado.includes(c.nombre.toLowerCase()),
        );
        if (clienteEncontrado) {
            this.formulario.patchValue({ cliente_id: clienteEncontrado.id });
            this.clienteDetectado = clienteEncontrado.nombre;
            if (!coincidenciaNit && clienteEncontrado.nit) {
                this.formulario.patchValue({ nit: clienteEncontrado.nit });
            }
        }

        // si el primer item aun esta vacio, se rellena con la primera linea util
        // del texto reconocido, como punto de partida para que el usuario la ajuste
        const primerItem = this.items.at(0);
        if (primerItem && !primerItem.get('descripcion_servicio')?.value) {
            const primeraLinea = texto
                .split('\n')
                .map((l) => l.trim())
                .find((l) => l.length > 6);
            if (primeraLinea) {
                primerItem.patchValue({ descripcion_servicio: primeraLinea });
            }
        }
    }

    // ================== guardar ==================
    guardar(): void {
        this.mensajeError = '';

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            this.mensajeError = 'Revisa los campos marcados antes de continuar.';
            return;
        }

        const valores = this.formulario.getRawValue();
        const items = valores.items.map((item: any) => ({
            descripcion_servicio: item.descripcion_servicio,
            cantidad: Number(item.cantidad),
            precio_unitario: Number(item.precio_unitario),
            subtotal: Number(item.cantidad) * Number(item.precio_unitario),
        }));

        const datos = {
            cliente_id: Number(valores.cliente_id),
            nit: valores.nit,
            fecha: valores.fecha || undefined,
            items,
            total: items.reduce((suma: number, i: any) => suma + i.subtotal, 0),
        };

        this.guardando = true;
        const peticion = this.esEdicion
            ? this.entidadService.actualizar('ordenes-compra', this.idEditando!, datos)
            : this.entidadService.crear('ordenes-compra', datos);

        peticion.subscribe({
            next: () => {
                this.guardando = false;
                this.router.navigate(['/ordenes-compra']);
            },
            error: (error) => {
                this.guardando = false;
                this.mensajeError = error?.error?.error || 'No se pudo guardar la orden de compra.';
            },
        });
    }
}
