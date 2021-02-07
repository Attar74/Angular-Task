import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Movie } from '../Movie.model';
import { MoviesService } from '../Movies.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: 'movie-list.component.html',
  styleUrls: ['movie-list.component.css'],
})

export class MovieListComponent implements OnInit, OnDestroy{

  // Movies = [
  //   {title: "BatMan", rating: 5, imgPath: "XXX", date: "11/ 12 / 2012"},
  //   {title: "SuperMan", rating: 5, imgPath: "XXX", date: "11/ 12 / 2012"},
  //   {title: "AntMan", rating: 5, imgPath: "XXX", date: "11/ 12 / 2012"},
  //   {title: "SpiderMan", rating: 5, imgPath: "XXX", date: "11/ 12 / 2012"}
  // ]
  Movies : Movie[] = [];
  private MovieSub: Subscription;

  constructor(public MoviesService: MoviesService){}

  isLoading = false;
  ngOnInit() {
    this.MoviesService.getMovies();
    this.isLoading = true;
    this.MovieSub = this.MoviesService.getMoviesUpdated().subscribe((Movies: Movie[])=>{
      this.Movies = Movies;
      this.isLoading = false;
    });
  }


  show(collapse){
    collapse.classList.toggle('show');
  }

  onDelete(_id: number){
    this.MoviesService.deleteMovie(_id);
  }

  ngOnDestroy(){
    this.MovieSub.unsubscribe();
  }

}
