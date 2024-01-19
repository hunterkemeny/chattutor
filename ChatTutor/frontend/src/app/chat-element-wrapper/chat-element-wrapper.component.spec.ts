import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatElementWrapperComponent } from './chat-element-wrapper.component';

describe('ChatElementWrapperComponent', () => {
  let component: ChatElementWrapperComponent;
  let fixture: ComponentFixture<ChatElementWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatElementWrapperComponent]
    });
    fixture = TestBed.createComponent(ChatElementWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
