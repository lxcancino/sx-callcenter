import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swrxFocusManager]'
})
export class FocusManagerDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log('Inicializando directive....');
    // elementRef.nativeElement.style.background='red';
  }

  @HostListener('keyup.enter', ['$event'])
  onEnter(event) {
    console.log('Enter up: ', event);
    this.renderer.setStyle(event.target, 'background', 'skyblue');
    const keyboardEvent = new KeyboardEvent('keydown', {
      code: 'Enter',
      key: 'Enter'
    });
    event.target.dispatchEvent(keyboardEvent);
  }
}
