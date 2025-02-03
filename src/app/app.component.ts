import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SectorsService } from './sectors.service';
import { DataService, UserDataDTO, UserDataResponseDTO } from './data.service';
import { SectorDTO } from './models';

interface DisplaySector {
  id: number;
  name: string;
  indent: string;
  isParent: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "Helmes homework";
  sectors: SectorDTO[] = [];
  displaySectors: DisplaySector[] = [];

  userForm: FormGroup;
  submitted = false;
  savedDataResponse: UserDataResponseDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private sectorsService: SectorsService,
    private dataService: DataService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      sectors: [[], Validators.required],
      agree: [false, Validators.requiredTrue],
      id: [null]
    });
  }

  ngOnInit(): void {
    this.sectorsService.getSectors().subscribe({
      next: (data: SectorDTO[]) => {
        this.sectors = data;
        this.buildDisplaySectors();
      },
      error: (err) => {
        console.error('Error fetching sectors', err);
      }
    });
  }

  buildDisplaySectors(): void {
    const childrenMap: { [parentId: number]: SectorDTO[] } = {};
    this.sectors.forEach(sector => {
      if (sector.parentId !== null) {
        if (!childrenMap[sector.parentId]) {
          childrenMap[sector.parentId] = [];
        }
        childrenMap[sector.parentId].push(sector);
      }
    });

    const traverse = (sector: SectorDTO, level: number, result: DisplaySector[]) => {
      const children = childrenMap[sector.id] || [];
      const isParent = children.length > 0;
      result.push({
        id: sector.id,
        name: sector.name,
        indent: '  '.repeat(level),
        isParent: isParent
      });
      children.sort((a, b) => a.name.localeCompare(b.name));
      children.forEach(child => traverse(child, level + 1, result));
    };

    const result: DisplaySector[] = [];
    const topLevel = this.sectors.filter(s => s.parentId === null);
    topLevel.sort((a, b) => a.name.localeCompare(b.name));
    topLevel.forEach(sector => traverse(sector, 0, result));
    this.displaySectors = result;
  }

  clearSelections(): void {
    this.userForm.get('sectors')?.setValue([]);
  }

  onSave(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const formData: UserDataDTO = this.userForm.value;
    if (this.savedDataResponse && this.savedDataResponse.id) {
      formData.id = this.savedDataResponse.id;
    }
    this.dataService.saveUserData(formData).subscribe({
      next: (response: UserDataResponseDTO) => {
        this.savedDataResponse = response;
        const patchedData: UserDataDTO = {
          id: response.id,
          name: response.name,
          agree: response.agree,
          sectors: response.sectors.map(sector => sector.id)
        };
        this.userForm.patchValue(patchedData);
        alert('Data saved successfully!');
        this.submitted = false;
        this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
      },
      error: (err) => {
        console.error('Error saving data', err);
        alert('There was an error saving your data.');
      }
    });
  }

  getSectorFullName(sector: SectorDTO): string {
    let parentNames: string[] = [];
    let currentParentId = sector.parentId;
    while (currentParentId !== null) {
      const parent = this.sectors.find(s => s.id === currentParentId);
      if (!parent) break;
      parentNames.push(parent.name);
      currentParentId = parent.parentId;
    }
    parentNames.reverse();
    return sector.name + (parentNames.length > 0 ? ` (${parentNames.join(' - ')})` : '');
  }
}
