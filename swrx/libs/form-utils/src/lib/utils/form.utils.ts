import { FormBuilder, Validators, FormGroup } from '@angular/forms';

export const buildDireccionForm = (fb: FormBuilder): FormGroup => {
  return fb.group(
    {
      calle: [null, [Validators.required]],
      numeroExterior: [null, [Validators.required]],
      numeroInterior: [null],
      codigoPostal: [
        null,
        { validators: [Validators.required], updateOn: 'blur' }
      ],
      colonia: [null, [Validators.required]],
      monicipio: [null],
      estado: [null, [Validators.required]],
      pais: ['MEXICO', [Validators.required]]
    },
    { updateOn: 'blur' }
  );
};
