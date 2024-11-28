import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }
  
  /**
   * Verifica si localStorage está disponible en el entorno actual.
   */
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /**
   * Saca información de localStorage.
   * @param key el nombre de la key del localStorage.
   * @returns el valor de la key o null si no se encuentra nada.
   */
  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Guarda información en localStorage.
   * @param key la key del localStorage.
   * @param value el valor a guardar.
   */
  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Elimina información del localStorage.
   * @param key la key del localStorage.
   */
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }
}
