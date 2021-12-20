import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './paxos/demo/demo.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { PanelComponent } from './paxos/panel/panel.component';
import { NaviComponent } from './paxos/navi/navi.component';
import { TransformRolePipe } from './shared/transform-role.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    PanelComponent,
    NaviComponent,
    TransformRolePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
