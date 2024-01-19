import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChatElementWrapperComponent } from './chat-element-wrapper/chat-element-wrapper.component';
import { ChatModule } from './chat.module';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    declarations: [ChatElementWrapperComponent],
    imports: [BrowserModule, ChatModule, BrowserAnimationsModule,],
    exports: [ChatElementWrapperComponent],
})
export class ElementModule implements DoBootstrap {
    constructor(
        private injector: Injector
    ) {
        const customComponent = createCustomElement(ChatElementWrapperComponent, { injector });
        customElements.define('chat-tutor', customComponent);
    }

    ngDoBootstrap(appRef: ApplicationRef) { }
}