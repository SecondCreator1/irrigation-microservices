import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisionFormComponent } from './prevision-form.component';

describe('PrevisionFormComponent', () => {
  let component: PrevisionFormComponent;
  let fixture: ComponentFixture<PrevisionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevisionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
