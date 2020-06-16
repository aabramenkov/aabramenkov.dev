import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from 'src/app/_models/post.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PhotoService } from '../../_services/photo.service';
import { BlogService } from '../../_services/blog.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  editor: any;
  post: Post;
  baseUrl = environment.apiUrl;
  isLoadInProgress: boolean;
  showInEditorToggle = 'text';
  tinyMceEditorModel: string;
  checked = true;

  editorConfig: any = {
    setup: (editor) => {
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private photoService: PhotoService,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.post = data.post;
    });
    this.tinyMceEditorModel = this.post.text;
  }
  tinyMceInsertPhotoUrl(editor: any) {
    document.getElementById('selectFile').click();
  }
  OnSubmit() {
    this.post.url = this.slugify(this.post.title);

    if (this.post.id === 0) {
      this.blogService.addPost(this.post).subscribe(
        (next) => {
          this.snackBar.open('Post created', 'JK', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Error on saving post', 'JK', {
            duration: 2000,
          });
        }
      );
    }

    this.blogService.updatePost(this.post.id, this.post).subscribe(
      (next) => {
        this.snackBar.open('Post sucesfully saved', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
      },
      (error) => {
        this.snackBar.open('Error on saving post', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warm'],
        });
      }
    );
  }
  onCancel() {
    this.blogService.getPost(this.post.id).subscribe(
      (p) => {
        this.post = p;
        this.tinyMceEditorModel = p.text;
        this.editor.setContent(p.text);
      },
      (err) => console.error(err)
    );
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

  private isImage(filename) {
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

  private getExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  onShowInEditorChange(value: any) {
    this.showInEditorToggle = value;

    if (this.showInEditorToggle === 'text') {
      this.tinyMceEditorModel = this.post.text;
    } else {
      this.tinyMceEditorModel = this.post.description;
    }
  }

  tinyMceEditorModelOnChange(newValue) {
    if (this.showInEditorToggle === 'text') {
      this.post.text = newValue;
    } else {
      this.post.description = newValue;
    }
  }

  postPublishedChange(value: boolean) {
    this.post.published = value;
  }

  slugify(value: string) {
    const a =
      'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
      'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');
    return value
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
