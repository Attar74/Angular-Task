import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { MoviesService } from '../Movies.service';
import { Movie } from '../Movie.model';
import { mimType } from './mime-type.validator';
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
  form: FormGroup;
  imagePreview: string | ArrayBuffer = '';
  private mode = 'create';
  private movieId: any; //number

  constructor(public MoviesService: MoviesService, public route: ActivatedRoute){};

  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'rate': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimType]
      }),
    })
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('MovieId')){
        this.mode = 'edit';
        this.movieId = paramMap.get("MovieId");
        this.isLoading = true;
        this.MoviesService.getMovie(this.movieId).subscribe((movieData)=>{
          this.isLoading = false;
          this.movie = {id: movieData._id, title: movieData.title, rate: movieData.rate, imagePath: movieData.imagePath};
          this.form.setValue({
            'title': this.movie.title,
            'rate': this.movie.rate,
            'imagePath': this.movie.imagePath
          })
        });
      } else{
        this.mode = 'create';
        this.movieId = null;
      }
    });
  }

  onSaveMovie(){
    if (this.form.invalid || isNaN(this.form.value.rate)) {
      return;
    }
    this.isLoading = true;
    if(this.mode == 'create'){
      this.MoviesService.addMovies(
        this.form.value.title,
        this.form.value.rate,
        this.form.value.image
      );
    } else{
      this.MoviesService.updateMovie(this.movieId, this.form.value.title,this.form.value.rate, this.form.value.image);
    }
    this.form.reset();
  }

  onImagePicked(e: Event){
    const file = (e.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
