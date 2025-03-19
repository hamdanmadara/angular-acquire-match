import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCreationComponent } from './job-creation.component';

describe('JobCreationComponent', () => {
  let component: JobCreationComponent;
  let fixture: ComponentFixture<JobCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
