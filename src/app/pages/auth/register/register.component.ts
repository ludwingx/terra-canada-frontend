import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  form = this.fb.group({
    nombre_usuario: ['', [Validators.required]],
    nombre_completo: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol_id: [3, [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting) return;
    this.errorMessage = '';
    this.isSubmitting = true;

    const payload = this.form.getRawValue();
    this.auth.register({
      nombre_usuario: String(payload.nombre_usuario || ''),
      nombre_completo: String(payload.nombre_completo || ''),
      email: String(payload.email || ''),
      password: String(payload.password || ''),
      rol_id: Number(payload.rol_id || 0)
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'No se pudo crear la cuenta';
      }
    });
  }
}
