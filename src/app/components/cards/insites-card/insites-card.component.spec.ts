import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsitesCardComponent } from './insites-card.component';

describe('InsitesCardComponent', () => {
  let component: InsitesCardComponent;
  let fixture: ComponentFixture<InsitesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsitesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsitesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
