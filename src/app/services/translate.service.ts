import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translate: TranslateService) {
    // Establece el idioma predeterminado
    this.translate.setDefaultLang('es');
  }

  // Cambia el idioma
  changeLanguage(language: string) {
    this.translate.use(language);
  }

  // Obtiene la traducción de una clave
  getTranslation(key: string) {
    return this.translate.get(key);
  }
}