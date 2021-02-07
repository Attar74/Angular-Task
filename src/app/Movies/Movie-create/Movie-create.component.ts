import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { MoviesService } from '../Movies.service';
import { Movie } from '../Movie.model';

@Component({
  selector: 'app-movie-create',
  templateUrl: 'Movie-create.component.html',
  styleUrls: ['Movie-create.component.css'],
})

export class MovieCreateComponent implements OnInit{

  enteredTitle: string = "";
  enteredRate: number ;
  movie: Movie;
  isLoading = false;
  private mode = 'create';
  private movieId: any; //number

  constructor(public MoviesService: MoviesService, public route: ActivatedRoute){};

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('MovieId')){
        this.mode = 'edit';
        this.movieId = paramMap.get("MovieId");
        this.isLoading = true;
        this.MoviesService.getMovie(this.movieId).subscribe((movieData)=>{
          this.isLoading = false;
          this.movie = {id: movieData._id, title: movieData.title, rate: movieData.rate};
        });
      } else{
        this.mode = 'create';
        this.movieId = null;
      }
    });
  }

  onSaveMovie(movieForm: NgForm){
    if (movieForm.invalid || isNaN(movieForm.value.rate)) {
      return;
    }
    this.isLoading = true;
    if(this.mode == 'create'){
      this.MoviesService.addMovies(movieForm.value.title,movieForm.value.rate);
    } else{
      this.MoviesService.updateMovie(this.movieId, movieForm.value.title,movieForm.value.rate);
    }
    movieForm.resetForm();
  }
}
