import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item';
import { DataService } from "../data.service";

@Component({
  selector: 'app-item-mods',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, AfterViewInit {
  items$: Observable<Item[]>|null = null;
  filterString: string = '';
  filterSubject: Subject<string> = new Subject<string>();
  selectedItem: Item|null = null;

  constructor(
    public data: DataService
  ) {
    let w: any = window;
    w.c = this;
  }

  ngOnInit(): void {
    this.items$ = combineLatest([
      this.data.getItems(),
      this.filterSubject
    ])
    .pipe(map(arr => {
      let items = arr[0];
      let filterString = arr[1];
      return items
      .filter(item => item.text && item.text.length > 0 && item.modifiers && item.modifiers.length > 0 )
      .filter(item => item.text.indexOf('Dev:') < 0)
      .filter(item => item.text.indexOf('(Ammo)') < 0)
      .filter(
        item => filterString.length === 0 ||
        item.text.toLowerCase().indexOf(filterString.toLowerCase()) >= 0
        || item == this.selectedItem)
    }));
  }

  ngAfterViewInit(): void {
    // submit initial filter after view initializes
    this.filterSubject.next('');
  }

  onFilterStringKeyup($event: KeyboardEvent) {
    this.filterSubject.next(this.filterString.toLowerCase())
  }

  selectItem(item: Item): void {
    this.selectedItem = item !== this.selectedItem ? item : null;
  }
}
