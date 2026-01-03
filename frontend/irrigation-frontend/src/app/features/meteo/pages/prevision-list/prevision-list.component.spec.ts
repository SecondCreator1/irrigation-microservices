import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisionListComponent } from './prevision-list.component';

describe('PrevisionListComponent', () => {
  let component: PrevisionListComponent;
  let fixture: ComponentFixture<PrevisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevisionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
