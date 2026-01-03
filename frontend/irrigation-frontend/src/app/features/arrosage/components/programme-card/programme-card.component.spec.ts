import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeCardComponent } from './programme-card.component';

describe('ProgrammeCardComponent', () => {
  let component: ProgrammeCardComponent;
  let fixture: ComponentFixture<ProgrammeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
