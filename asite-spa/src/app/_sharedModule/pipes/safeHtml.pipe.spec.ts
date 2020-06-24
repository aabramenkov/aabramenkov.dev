import { SafeHtmlPipe } from './safeHtml.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
      ],
    });
  });
  it('create an instance', () => {
    const ds = TestBed.inject(DomSanitizer);
    const pipe = new SafeHtmlPipe(ds);
    expect(pipe).toBeTruthy();
  });

  it('should return string with html tags', () => {
    const ds = TestBed.inject(DomSanitizer);
    const pipe = new SafeHtmlPipe(ds);

    expect(pipe.transform('<p> test </p>', 'html')).toEqual('<p> test </p>');
  });
});
