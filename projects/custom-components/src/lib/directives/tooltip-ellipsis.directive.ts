import { AfterViewInit, Directive, ElementRef, HostListener, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';


@Directive({
  selector: '[appTooltipEllipsis]',
  providers:[MatTooltip],
  
  
})
export class TooltipEllipsisDirective implements AfterViewInit{

  constructor(private el: ElementRef, private renderer: Renderer2, private tooltip: MatTooltip) { }
  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    element.style.setProperty('overflow','hidden')  
    element.style.setProperty('text-overflow','ellipsis')
    element.style.setProperty('text-wrap','nowrap')
    element.style.setProperty('max-width','100%')

  }
  @HostListener('mouseover', ['$event'])
  checkOverflow() {
    const element = this.el.nativeElement;
    if (element.scrollWidth > element.clientWidth) {
      element.style.setProperty('cursor','pointer')
      this.tooltip.message=element.textContent;
      this.tooltip.show();    
   } else {
      this.tooltip.hide()
   }
  }
  @HostListener('mouseout',['$event'])
  hidetooltip(){
    this.tooltip.hide()
  }


}
