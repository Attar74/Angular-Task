import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieCreateComponent } from './Movies/Movie-create/Movie-create.component';
import { MovieListComponent } from './Movies/Movie-list/Movie-list.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
// import { MoviesService } from './Movies/Movies.service';

@NgModule({
  declarations: [
    AppComponent,
    MovieCreateComponent,
    HeaderComponent,
    MovieListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [], //U can add MoviesService instead of useing Injectable at service file
  bootstrap: [AppComponent]
})
export class AppModule { }
