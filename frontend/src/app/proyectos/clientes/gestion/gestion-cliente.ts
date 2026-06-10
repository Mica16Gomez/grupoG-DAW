import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  signal,
  WritableSignal,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { UpdateClienteDto } from "./update-cliente-dto";
import { EstadosClientesEnum } from "../estados-clientes-enum";
import { GestionClienteApiClient } from "./gestion-cliente-api-client";
import { CreateClienteDTO } from "./create-cliente-dto";
import { ListClienteDTO } from "../listado/list-cliente-dto";

const DOMINIOS_PERMITIDOS: string[] = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.com.ar",
  "icloud.com",
];

function emailDominioPermitidoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor || typeof valor !== "string") {
      return null;
    }

    const email = valor.trim().toLowerCase();
    const partes = email.split("@");

    if (partes.length !== 2) {
      return null;
    }

    const dominio = partes[1];

    if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
      return {
        emailDominioNoPermitido: true,
      };
    }

    return null;
  };
}

@Component({
  selector: "app-gestion-cliente",
  templateUrl: "./gestion-cliente.html",
  styleUrls: ["./gestion-cliente.css"],
  imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule],
})
export class GestionCliente {
  visible: ModelSignal<boolean> = model<boolean>(false);
  clienteSeleccionado: ModelSignal<ListClienteDTO | null> =
    model<ListClienteDTO | null>(null);
  readonly idProyecto: InputSignal<number | null> = input<number | null>(null);

  readonly estados: WritableSignal<EstadosClientesEnum[]> = signal(
    Object.values(EstadosClientesEnum)
  );

  private readonly messageService: MessageService = inject(MessageService);
  private readonly gestionClienteApiClient = inject(GestionClienteApiClient);

  readonly header: Signal<string> = computed(() => {
    if (this.clienteSeleccionado()) {
      return "Editar cliente";
    }

    return "Crear cliente";
  });

  readonly form: FormGroup = new FormGroup({
    nombre: new FormControl("", [Validators.required]),
    telefono: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\+?[1-9]\d{5,14}$/),
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
      emailDominioPermitidoValidator(),
    ]),
    estado: new FormControl<EstadosClientesEnum | null>(null),
  });

  constructor() {
    effect(() => {
      if (this.clienteSeleccionado()) {
        this.form.patchValue({
          nombre: this.clienteSeleccionado()?.nombre ?? "",
          telefono: this.clienteSeleccionado()?.telefono ?? "",
          email: this.clienteSeleccionado()?.email ?? "",
          estado: this.clienteSeleccionado()?.estado ?? null,
        });
      } else {
        this.form.reset({
          nombre: "",
          telefono: "",
          email: "",
          estado: null,
        });
      }
    });
  }

  private normalizarTexto(valor: string): string {
    return valor.trim();
  }

  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  cerrarDialog(): void {
    this.clienteSeleccionado.set(null);
    this.form.reset({
      nombre: "",
      telefono: "",
      email: "",
      estado: null,
    });
    this.visible.set(false);
  }

  guardarCliente(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Por favor, complete todos los campos requeridos.",
      });
      return;
    }

    const formRawValue = this.form.getRawValue();

    if (this.clienteSeleccionado()) {
      const dto: UpdateClienteDto = {
        nombre: this.normalizarTexto(formRawValue.nombre),
        telefono: this.normalizarTexto(formRawValue.telefono),
        email: this.normalizarEmail(formRawValue.email),
        estado: formRawValue.estado!,
      };

      this.gestionClienteApiClient
        .actualizarCliente(this.clienteSeleccionado()?.id!, dto)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Éxito",
              detail: "Cliente actualizado correctamente.",
            });
            this.cerrarDialog();
          },
          error: (err) => {
            let detail = "";

            if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
              detail = Array.isArray(err.error.message)
                ? err.error.message.join(", ")
                : err.error.message;
            } else {
              detail = "Ha ocurrido un error al actualizar el cliente";
            }

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail,
            });
          },
        });
    } else {
      const dto: CreateClienteDTO = {
        nombre: this.normalizarTexto(formRawValue.nombre),
        telefono: this.normalizarTexto(formRawValue.telefono),
        email: this.normalizarEmail(formRawValue.email),
      };

      this.gestionClienteApiClient.crearCliente(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Cliente creado correctamente.",
          });
          this.cerrarDialog();
        },
        error: (err) => {
          let detail = "";

          if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
            detail = Array.isArray(err.error.message)
              ? err.error.message.join(", ")
              : err.error.message;
          } else {
            detail = "Ha ocurrido un error al crear el cliente";
          }

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail,
          });
        },
      });
    }
  }
}