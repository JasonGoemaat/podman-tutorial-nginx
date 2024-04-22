import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from "./models/item";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  itemsUrl = 'assets/items.json';
  itemModifiersUrl = 'assets/item_modifiers.json';

  constructor(
    public http: HttpClient
  ) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl);
  }
}
