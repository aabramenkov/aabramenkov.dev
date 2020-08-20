import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContextService } from 'src/app/_services/context.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Article } from 'src/app/_models/article.model';
import { PhotoService } from 'src/app/area-admin/_services/photo.service';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {
  editor: any;
  baseUrl = environment.apiUrl;
  isLoadInProgress: boolean = false;
  article!: Article;
  tinyMceEditorModel: string | undefined;
  showInEditorToggle = 'text';

  editorConfig: any = {
    setup: (editor: any) => {
      this.editor = editor;
      editor.ui.registry.addButton('addImage', {
        text: 'Add Image',
        onAction: () => {
          this.tinyMceInsertPhotoUrl(editor);
        },
      });
    },
    base_url: '/tinymce',
    suffix: '.min',
    height: 500,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | removeformat | help| addImage',
  };

  constructor(
    private contextService: ContextService,
    private snackBar: MatSnackBar,
    private rout: ActivatedRoute,
    private photoService: PhotoService
  ) {}

  ngOnInit() {
    this.rout.data.subscribe((data) => {
      this.article = data.article;
      if (this.article) {
        this.tinyMceEditorModel = this.article.text;
      }else{
        this.tinyMceEditorModel = '';
      }
    });
  }
  tinyMceInsertPhotoUrl(editor: any) {
    const element = document.getElementById('selectFile');
    if (element) {
      element.click();
    }
  }

  OnSubmit() {
    if (!this.article?.id){
      return;
    }
    this.contextService.updateArticle(this.article.id, this.article).subscribe(
      (next) => {
        this.snackBar.open('Article sucesfully saved', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
      },
      (error) => {
        this.snackBar.open('Error on saving article', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warm'],
        });
      }
    );
  }
  OnCancel() {
    if (!this.article?.id){
      return;
    }
    this.contextService.getArticle(this.article.id).subscribe((a) => {
      this.article = a;
    });
  }

  handleFileInput(files: FileList) {
    if (files.length > 1) {
      this.snackBar.open('Multiply files selecting nog allowed');
      return;
    }

    const fileToUpload = files.item(0);
    if (!fileToUpload) {
      return;
    }

    if (!this.isImage(fileToUpload.name)) {
      this.snackBar.open('Only image file can be uploaded', 'JK', {
        duration: 2000,
      });
      return;
    }

    if (fileToUpload.size > 1 * 1024 * 1024) {
      this.snackBar.open('File size must be less then 1 mb', 'JK', {
        duration: 2000,
      });
      return;
    }
    this.isLoadInProgress = true;
    this.photoService.uploadPhoto(fileToUpload).subscribe(
      (response) => {
        const uri = response.uri;
        const tagToInsert =
          '<img style="float: left; max-width: 100%; min-width: 50%; margin: 5px;" src="' +
          uri +
          '"/>';
        this.isLoadInProgress = false;
        this.snackBar.open(
          'File ' + fileToUpload.name + ' uploaded sucesfully',
          'JK',
          { duration: 2000 }
        );
        this.editor.execCommand('mceInsertContent', false, tagToInsert);
      },
      (error) => {
        console.log(error);
        this.isLoadInProgress = false;
        this.snackBar.open('Error! File not uploaded', 'JK', {
          duration: 2000,
        });
      }
    );
  }

  private isImage(filename: string) {
    const ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'jpeg':
        return true;
    }
    return false;
  }

  private getExtension(filename: string) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  onShowInEditorChange(value: any) {
    this.showInEditorToggle = value;

    if (this.showInEditorToggle === 'text') {
      this.tinyMceEditorModel = this.article?.text ?? '';
    } else {
      this.tinyMceEditorModel = this.article?.shortDescription ?? '';
    }
  }

  tinyMceEditorModelOnChange(newValue: string) {
    if (!this.article?.text){
      return;
    }
    if (this.showInEditorToggle === 'text') {
      this.article.text = newValue;
    } else {
      this.article.shortDescription = newValue;
    }
  }
}
