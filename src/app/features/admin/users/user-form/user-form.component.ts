import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Documento -->
        <div class="field">
            <label class="block text-slate-300 mb-1">Tipo Documento</label>
            <p-select [options]="tiposDocumento" formControlName="tipoDocumento" appendTo="body" styleClass="w-full"></p-select>
        </div>
         <div class="field">
            <label class="block text-slate-300 mb-1">Número Documento</label>
            <input pInputText formControlName="numeroDocumento" class="w-full" />
        </div>

        <!-- Nombres -->
        <div class="field">
            <label class="block text-slate-300 mb-1">Nombres</label>
            <input pInputText formControlName="nombres" class="w-full" />
        </div>
        <div class="field">
            <label class="block text-slate-300 mb-1">Apellidos</label>
            <input pInputText formControlName="apellidos" class="w-full" />
        </div>

        <!-- Vehiculo -->
        <div class="field">
            <label class="block text-slate-300 mb-1">Tipo Vehículo</label>
            <p-select [options]="tiposVehiculo" formControlName="tipoVehiculo" appendTo="body" styleClass="w-full"></p-select>
        </div>
        <div class="field">
            <label class="block text-slate-300 mb-1">Placa</label>
            <input pInputText formControlName="placa" class="w-full uppercase" />
        </div>

        <!-- Info Laboral -->
        <div class="field">
            <label class="block text-slate-300 mb-1">Tipo Contrato</label>
            <p-select [options]="tiposContrato" formControlName="tipoContrato" appendTo="body" styleClass="w-full"></p-select>
        </div>
        <div class="field">
            <label class="block text-slate-300 mb-1">Cargo</label>
            <input pInputText formControlName="cargo" class="w-full" />
        </div>

        <!-- Contacto -->
        <div class="field">
            <label class="block text-slate-300 mb-1">Email</label>
            <input pInputText formControlName="email" class="w-full" />
        </div>
        <div class="field">
            <label class="block text-slate-300 mb-1">Contacto</label>
            <input pInputText formControlName="contacto" class="w-full" />
        </div>

        <div class="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
            <button pButton label="Cancelar" type="button" class="p-button-text p-button-secondary" (click)="onCancel.emit()"></button>
            <button pButton label="Guardar" type="submit" [disabled]="userForm.invalid"></button>
        </div>
    </form>
  `,
  styles: [`
    :host ::ng-deep .p-dropdown {
        width: 100%;
        background: #1e293b; /* slate-800 */
        border-color: #334155; /* slate-700 */
    }
    :host ::ng-deep .p-dropdown-label {
        color: white;
    }
    :host ::ng-deep .p-inputtext {
        background: #1e293b;
        border-color: #334155;
        color: white;
    }
  `]
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() onSave = new EventEmitter<User>();
  @Output() onCancel = new EventEmitter<void>();

  userForm: FormGroup;

  tiposDocumento = ['CC', 'CE', 'Pasaporte', 'TI'];
  tiposVehiculo = ['Moto', 'Carro'];
  tiposContrato = ['Funcionario', 'Contratista', 'Aprendiz', 'Otros'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      id: [null],
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoVehiculo: ['Moto', Validators.required],
      placa: ['', Validators.required],
      tipoContrato: ['Funcionario', Validators.required],
      cargo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contacto: ['', Validators.required],
      estado: ['Activo']
    });
  }

  ngOnInit() {
    // init
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue(this.user);
    } else if (changes['user'] && !this.user) {
      this.userForm.reset({
        tipoDocumento: 'CC',
        tipoVehiculo: 'Moto',
        tipoContrato: 'Funcionario',
        estado: 'Activo'
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.onSave.emit(this.userForm.value);
    }
  }
}
