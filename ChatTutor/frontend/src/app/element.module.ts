import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChatElementWrapperComponent } from './chat-element-wrapper/chat-element-wrapper.component';
import { ChatModule } from './chat.module';
import { createCustomElement } from '@angular/elements';

@NgModule({
    declarations: [ChatElementWrapperComponent],
    imports: [BrowserModule, ChatModule],
    exports: [ChatElementWrapperComponent]
})
export class ElementModule implements DoBootstrap {
    constructor(
        private injector: Injector
    ) { }

    ngDoBootstrap(appRef: ApplicationRef) {
        const key = "chat-tutor";
        if (!customElements.get(key)) {
            // Register only if 'login-provider' entry is not found in the registry

            // Step 3: loginComponent stores the constructor class
            const component = createCustomElement(ChatElementWrapperComponent, {
                injector: this.injector,    // This injector is used to load the component's factory
            });

            // Step 4: Registering custom tag 'login-provider' with the obtained custom class
            customElements.define(key, component);
        }
    }
}