import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeFormComponent } from './programme-form.component';

describe('ProgrammeFormComponent', () => {
  let component: ProgrammeFormComponent;
  let fixture: ComponentFixture<ProgrammeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
