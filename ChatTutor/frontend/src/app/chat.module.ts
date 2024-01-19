import { NgModule } from "@angular/core";
import { MessageComponent } from "./message/message.component";
import { DocheaderComponent } from "./docheader/docheader.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";
import { DatasetChipsComponent } from "./dataset-chips/dataset-chips.component";
import { InputBoxComponent } from "./input-box/input-box.component";
import { PaperChipComponent } from "./paper-chip/paper-chip.component";
import { MathjaxComponent } from "./mathjax/mathjax.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";
import { TextFieldModule } from "@angular/cdk/text-field";
import { MatInputModule } from "@angular/material/input";

@NgModule({
    declarations: [
        ChatWindowComponent,
        ChatWindowComponent,
        MessageComponent,
        DocheaderComponent,
        DatasetChipsComponent,
        InputBoxComponent,
        PaperChipComponent,
        MathjaxComponent
    ],
    imports: [
        TextFieldModule,
        MatChipsModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        FormsModule
    ],
    exports: [ChatWindowComponent]
})
export class ChatModule {

}