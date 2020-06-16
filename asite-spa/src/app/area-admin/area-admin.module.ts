import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaAdminRoutes } from './area-admin.routing';
import { AreaAdminComponent } from './area-admin.component';
import { MaterialAdminArea } from './_materialModule/material-adminarea.module';
import { SidenavListAdminComponent } from './navigation/SidenavListAdmin/SidenavListAdmin.component';
import { HeaderAdminComponent } from './navigation/headerAdmin/headerAdmin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsersComponent } from './users/users.component';
import { AdminService } from './_services/admin.service';
import { DialogEditRoleComponent } from './users/dialog-edit-role/dialog-edit-role.component';
import { FormsModule } from '@angular/forms';
import { ArticleResolver } from './_resolvers/article.Resolver';
import { ContextEditorComponent } from './context-editor/context-editor.component';
import { RichTextEditorComponent } from './context-editor/components/rich-text-editor/rich-text-editor.component';
import { TreeviewComponent } from './context-editor/components/treeview/treeview.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../_sharedModule/shared.module';
import { PostsComponent } from './blog/posts/posts.component';
import { PostComponent } from './blog/post/post.component';
import { PostResolver } from './_resolvers/post.Resolver';
import { BlogService } from './_services/blog.service';
import { PhotoService } from './_services/photo.service';

@NgModule({
  declarations: [
    AreaAdminComponent,
    SidenavListAdminComponent,
    HeaderAdminComponent,
    UsersComponent,
    DialogEditRoleComponent,
    ContextEditorComponent,
    RichTextEditorComponent,
    TreeviewComponent,
    PostsComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    AreaAdminRoutes,
    MaterialAdminArea,
    FlexLayoutModule,
    FormsModule,
    EditorModule,
    SharedModule,
  ],
  exports: [],
  entryComponents: [DialogEditRoleComponent],

  providers: [
    AdminService,
    BlogService,
    PhotoService,
    ArticleResolver,
    PostResolver,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class AreaAdminModule {}
