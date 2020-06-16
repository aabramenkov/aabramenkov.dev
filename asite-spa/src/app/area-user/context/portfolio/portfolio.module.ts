import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { SharedModule } from 'src/app/_sharedModule/shared.module';
import { PortfolioComponent } from './portfolio.component';
import { MaterialUserAreaModule } from '../../_materialModule/material-userarea.module';
import { DialogArticleComponent } from '../../_dialog-article/dialog-article.component';

@NgModule({
  declarations: [PortfolioComponent,  DialogArticleComponent],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    SharedModule,
    MaterialUserAreaModule,
  ],
  entryComponents: [DialogArticleComponent]
})
export class PortfolioModule {}
