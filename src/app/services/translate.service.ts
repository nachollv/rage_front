import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang: string = 'es'
  constructor(private translate: TranslateService) {
    this.currentLang != localStorage.getItem("preferredLang")
    // Establece el idioma predeterminado
    this.translate.setDefaultLang(this.currentLang.split("-")[0]);
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