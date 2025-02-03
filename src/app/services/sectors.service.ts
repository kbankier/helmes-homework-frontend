import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SectorDTO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {
  private sectorsUrl = environment.apiUrl + environment.apiEndpoints.sectors;

  constructor(private http: HttpClient) {}

  getSectors(): Observable<SectorDTO[]> {
    return this.http.get<SectorDTO[]>(this.sectorsUrl);
  }
}
