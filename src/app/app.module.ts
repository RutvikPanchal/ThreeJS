import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EngineComponent } from './components/engine/engine.component';
import { UiComponent } from './components/ui/ui.component';

@NgModule({
    declarations: [
        AppComponent,
        EngineComponent,
        UiComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }