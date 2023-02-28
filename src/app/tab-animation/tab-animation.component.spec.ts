import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAnimationComponent } from './tab-animation.component';

describe('TabAnimationComponent', () => {
  let component: TabAnimationComponent;
  let fixture: ComponentFixture<TabAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
