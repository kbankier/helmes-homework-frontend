import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SectorDTO } from './models';

export interface UserDataDTO {
  id?: number;
  name: string;
  sectors: number[];
  agree: boolean;
}

export interface UserDataResponseDTO {
  id: number;
  name: string;
  agree: boolean;
  sectors: SectorDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userDataUrl = environment.apiUrl + environment.apiEndpoints.users;

  constructor(private http: HttpClient) {}

  saveUserData(data: UserDataDTO): Observable<UserDataResponseDTO> {
    const payload = {
      name: data.name,
      agree: data.agree,
      sectorIds: data.sectors
    };
    if (data.id) {
      return this.http.put<UserDataResponseDTO>(`${this.userDataUrl}/${data.id}`, payload);
    } else {
      return this.http.post<UserDataResponseDTO>(this.userDataUrl, payload);
    }
  }
}
