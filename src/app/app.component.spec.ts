import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SectorsService } from './sectors.service';
import { DataService } from './data.service';
import { of } from 'rxjs';

const sectorsServiceStub = {
  getSectors: () =>
    of([
      { id: 1, name: 'Manufacturing', parentId: null },
      { id: 5, name: 'Printing', parentId: 1 },
      { id: 6, name: 'Food and Beverage', parentId: 1 },
    ])
};

const dataServiceStub = {
  saveUserData: (data: any) =>
    of({
      id: 100,
      name: data.name,
      agree: data.agree,
      sectors: [{ id: 5, name: 'Printing', parentId: 1 }]
    })
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AppComponent],
      providers: [
        { provide: SectorsService, useValue: sectorsServiceStub },
        { provide: DataService, useValue: dataServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with initial controls', () => {
    expect(component.userForm).toBeTruthy();
    expect(component.userForm.contains('name')).toBeTrue();
    expect(component.userForm.contains('sectors')).toBeTrue();
    expect(component.userForm.contains('agree')).toBeTrue();
  });

  it('should mark form invalid when required fields are empty', () => {
    component.userForm.controls['name'].setValue('');
    component.userForm.controls['sectors'].setValue([]);
    component.userForm.controls['agree'].setValue(false);
    expect(component.userForm.invalid).toBeTrue();
  });

  it('should clear sector selections when clearSelections is called', () => {
    component.userForm.controls['sectors'].setValue([1, 5]);
    component.clearSelections();
    expect(component.userForm.controls['sectors'].value).toEqual([]);
  });

  it('should call dataService.saveUserData and update form on valid submission', () => {
    const spySave = spyOn(dataServiceStub, 'saveUserData').and.callThrough();
    component.userForm.controls['name'].setValue('Some Name');
    component.userForm.controls['sectors'].setValue([5]);
    component.userForm.controls['agree'].setValue(true);
    component.onSave();
    expect(spySave).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.userForm.controls['name'].value).toEqual('Some Name');
  });

  it('should build displaySectors with proper indentation and isParent flags', () => {
    component.buildDisplaySectors();
    const manufacturing = component.displaySectors.find(ds => ds.id === 1);
    expect(manufacturing?.indent).toEqual('');
    expect(manufacturing?.isParent).toBeTrue();

    const printing = component.displaySectors.find(ds => ds.id === 5);
    expect(printing?.indent).not.toEqual('');
    expect(printing?.isParent).toBeFalse();
  });

  it('should return correct full name for a sector with no parent', () => {
    const sector = { id: 1, name: 'Manufacturing', parentId: null };
    const fullName = component.getSectorFullName(sector);
    expect(fullName).toEqual('Manufacturing');
  });

  it('should return correct full name for a sector with one parent', () => {
    const sector = { id: 5, name: 'Printing', parentId: 1 };
    const fullName = component.getSectorFullName(sector);
    expect(fullName).toEqual('Printing (Manufacturing)');
  });

  it('should return correct full name for a sector with two levels of parents', () => {
    component.sectors = [
      { id: 10, name: 'Grandparent', parentId: null },
      { id: 2, name: 'Parent', parentId: 10 },
      { id: 3, name: 'Child', parentId: 2 }
    ];
    const sector = { id: 3, name: 'Child', parentId: 2 };
    const fullName = component.getSectorFullName(sector);
    expect(fullName).toEqual('Child (Grandparent - Parent)');
  });
});
