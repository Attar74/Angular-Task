import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Movie } from './Movie.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { title } from 'process';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {

  private Movies: Movie[] = [];
  private MoviesUpdated = new Subject <Movie[]> ();

  constructor(private http: HttpClient, private router: Router) {

  }
  getMovies(){
    // return [...this.Movies]; //To keep Original array as it
    this.http.get<{message: string, Movies: any}>('http://localhost:3000/api/movies')
    .pipe(map((movieData)=>{
      return movieData.Movies.map(movie => {
        return {
          title: movie.title,
          rate: movie.rate,
          id: movie._id,
          imagePath: movie.imagePath
        }
      })
    }))
    .subscribe((_Movies)=>{
      this.Movies = _Movies;
      this.MoviesUpdated.next([...this.Movies]);
    });
  }

  getMoviesUpdated(){
    return this.MoviesUpdated.asObservable();
  }

  getMovie(_id: number){
    return this.http.get<{_id:number, title: string, rate: number, imagePath: string}>
    (`http://localhost:3000/api/movies/${_id}`);
  }

  addMovies(_title: string, _rate: any, _image: File){
    const movieData = new FormData();
    movieData.append("title", _title);
    movieData.append("rate", _rate);
    movieData.append("image", _image, _title);

    this.http
    .post<{mesage: string, movie: Movie}>(
      "http://localhost:3000/api/movies",
      movieData
    ).subscribe((resData)=>{
      const Movie: Movie = {
        id: resData.movie.id,
        title: _title,
        rate: _rate,
        imagePath: resData.movie.imagePath
      }
      const id = resData.movie.id;
      Movie.id = id;
      this.Movies.push(Movie);
      this.MoviesUpdated.next([...this.Movies]);
      this.router.navigate(["/"]);
    });
  }

  updateMovie(_id: any, _title: string, _rate: any, _image: File | string){
    let movieData: FormData | Movie;
    if(typeof(_image) == 'object'){
      movieData = new FormData();
      movieData.append("id", _id);
      movieData.append('title', _title);
      movieData.append('rate', _rate);
      movieData.append('image', _image, _title);
    }else{
      const movieData: Movie = {id: _id , title: _title, rate: _rate, imagePath: _image};
    }
    this.http.put(`http://localhost:3000/api/movies/${_id}`, movieData)
    .subscribe((response)=>{
      const updatedMovies = [...this.Movies];
      const oldPostIndex = updatedMovies.findIndex((m)=>{m.id === _id});
      const movie: Movie = {id: _id , title: _title, rate: _rate, imagePath: ""};
      updatedMovies[oldPostIndex] = movie;
      this.Movies = updatedMovies;
      this.MoviesUpdated.next([...this.Movies]);
      this.router.navigate(["/"]);
    });
  }

  deleteMovie(_id: number){
    this.http.delete(`http://localhost:3000/api/movies/${_id}`)
    .subscribe(()=>{
      const updatedMovies = this.Movies.filter((movie)=>{
        return movie.id !== _id;
      })
      this.Movies = updatedMovies;
      this.MoviesUpdated.next([...this.Movies]);
    })


  }
}
