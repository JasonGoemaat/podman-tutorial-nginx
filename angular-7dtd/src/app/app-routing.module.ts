import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from "./items/items.component";
import { HomeComponent } from "./home/home.component";
import { ModsComponent } from "./mods/mods.component";

const routes: Routes = [
  { path: '', redirectTo: "/items", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'mods', component: ModsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
