import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export class CustomValidators {
    static passwordValidator(password:string, passwordRepeat:string): ValidatorFn {
        return (control:AbstractControl): ValidationErrors | null => {
            const passwordCtrl = control.get(password);
            const passwordRepeatCtrl = control.get(passwordRepeat);
            return passwordCtrl && passwordRepeatCtrl && passwordCtrl.value!=passwordRepeatCtrl 
                ? {mismatch:true} : null;
        };
    }
}
