import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieCreateComponent } from './Movies/Movie-create/Movie-create.component';
import { MovieListComponent } from './Movies/Movie-list/Movie-list.component';

const routes: Routes = [
  {path: '', component: MovieListComponent},
  {path: 'create', component: MovieCreateComponent},
  {path: 'edit/:movieId', component: MovieCreateComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
