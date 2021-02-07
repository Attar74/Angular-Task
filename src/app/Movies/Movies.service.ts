import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Movie } from './Movie.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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
          id: movie._id
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
    return this.http.get<{_id:number, title: string, rate: number}>(`http://localhost:3000/api/movies/${_id}`);
  }

  addMovies(_title: string, _rate: number){
    const Movie: Movie = {id: null, title: _title, rate: _rate};
    this.http.post<{mesage: string, _id: number}>("http://localhost:3000/api/movies", Movie).subscribe((resData)=>{
      const id = resData._id;
      Movie.id = id;
      this.Movies.push(Movie);
      this.MoviesUpdated.next([...this.Movies]);
      this.router.navigate(["/"]);
    });
  }

  updateMovie(_id: number, _title: string, _rate: number){
    const movie: Movie = {id: _id, title: _title, rate: _rate};
    this.http.put(`http://localhost:3000/api/movies/${_id}`, movie)
    .subscribe((response)=>{
      const updatedMovies = [...this.Movies];
      const oldPostIndex = updatedMovies.findIndex((m)=>{m.id === movie.id});
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
