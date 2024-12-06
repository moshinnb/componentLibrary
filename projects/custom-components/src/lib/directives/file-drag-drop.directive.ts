import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective implements OnInit {

  @Output() appFileDragDrop = new EventEmitter()
  @Input() top : string = '25%'
  @Input() right : string = '50%'
  @Input() height : string = 'none'


  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.createDropHere()
  }

  createDropHere() {
    const element = this.renderer.createElement('div')
    const text = this.renderer.createText('Drop Here')
    this.renderer.appendChild(element, text)
    this.renderer.addClass(element, 'vdm-position-absolute')
    this.renderer.setAttribute(element,'id','displayDropHere')
    // this.renderer.setStyle(element, 'top', this.top)
    // this.renderer.setStyle(element, 'right', this.right)
    this.renderer.appendChild(this.elementRef.nativeElement, element)
  }

  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault()
    const parentRef = this.elementRef.nativeElement as HTMLElement    
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.height)
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'height 0.5s')
    parentRef.classList.add('vdm-position-relative','displayDropHere')
    parentRef.classList.remove('hideDropHere')
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault()
    this.renderer.removeStyle(this.elementRef.nativeElement, 'height')
    const parentRef = this.elementRef.nativeElement as HTMLElement
    parentRef.classList.replace('displayDropHere', 'hideDropHere')
  }

  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault()
    this.renderer.removeStyle(this.elementRef.nativeElement, 'height')
    const parentRef = this.elementRef.nativeElement as HTMLElement
    parentRef.classList.remove('vdm-position-relative', 'displayDropHere')
    let files = evt.dataTransfer.files
    if (files.length > 0) {
      this.appFileDragDrop.emit(files)
    }
  }

  @HostListener('mouseover', ['$event']) public onmouseover(evt: any) {
    evt.preventDefault()
    const parentRef = this.elementRef.nativeElement as HTMLElement
    parentRef.children[0].classList.add('drag-drop-pointer-event-all')
  }

  @HostListener('mouseleave', ['$event']) public onmouseleave(evt: any) {
    evt.preventDefault()
    const parentRef = this.elementRef.nativeElement as HTMLElement
    parentRef.children[0].classList.remove('drag-drop-pointer-event-all')
  }
}
