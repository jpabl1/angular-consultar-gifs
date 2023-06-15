import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})

export class GifsService {

  constructor ( private http : HttpClient ) { 
    this.loadLocalStorage();
  }

  public gifList : Gif [] = [];

  private apiKey : string = 'y54WsFOvLXkzPydp8pLo6spl1SMCq6Ld';
  private _tagsHistory : string [] = [];
  private serviceUrl : string = 'https://api.giphy.com/v1/gifs';

  get tagsHistory () {
    return [...this._tagsHistory];
  }

  private organizeHistory ( tag : string ) : void {
    
    tag = tag.toLowerCase();
    
    if ( this._tagsHistory.includes( tag )) 
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag  );
    
    this._tagsHistory.unshift(tag);
    
    this._tagsHistory = this._tagsHistory.splice( 0 , 10 );
    this.saveLocalStorage();
  }

  private saveLocalStorage () : void {
    localStorage.setItem( 'history' , JSON.stringify( this._tagsHistory ) );
  }

  private loadLocalStorage () : void {

    if ( !localStorage.getItem( 'history') ) return;
    
    this._tagsHistory = JSON.parse( localStorage.getItem( 'history')! );
    
    if ( this._tagsHistory.length === 0 ) return;
    
    this.searchTag( this._tagsHistory[0] );

  }

  // async searchTag ( tag : string ): Promise<void> {
  searchTag ( tag : string ) : void {
    
    if ( tag.length === 0 ) return;
    
    const params = new HttpParams()
    .set( 'api_key' , this.apiKey )
    .set( 'limit', '10')
    .set( 'q' , tag ); 

    // fetch( 'https://api.giphy.com/v1/gifs/search?q=smash&api_key=y54WsFOvLXkzPydp8pLo6spl1SMCq6Ld&limit=10' )
    // .then( resp => resp.json() )
    // .then( data => console.log(data));

    this.http.get<SearchResponse>( `${ this.serviceUrl }/search`, { params } )
      .subscribe( resp => {
        this.gifList = resp.data;
      });
    
    this.organizeHistory( tag );

  }

}