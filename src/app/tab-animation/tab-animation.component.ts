import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-animation',
  templateUrl: './tab-animation.component.html',
  styleUrls: ['./tab-animation.component.css']
})
export class TabAnimationComponent implements OnInit {
  @Input() tabs: any;
  @Output() onChange = new EventEmitter<any>();

  // tabs: Array<any> = [{ title: 'startup' }, { title: 'expert' }, { title: 'institution' }];
  currentTabIndex = 0;
  currentWidth: any;
  colors: Array<any> = [];

  constructor() {

  }

  ngOnInit() {
    if (this.tabs !== undefined) {
      this.currentWidth = 100 / this.tabs.length;
      for (let x = 0; x < this.tabs.length; x++) {
        this.colors.push(this.tabs[x].color);
      }
      this.setWidth();
    }
  }

  setWidth() {
    let tabIndicator = document.getElementsByClassName("tab-indicator")[0] as HTMLSelectElement;
    tabIndicator.style.width = this.currentWidth + '%';
  }

  changeTab(x: any) {
    this.currentTabIndex = x;
    let tabIndicator = document.getElementsByClassName("tab-indicator")[0] as HTMLSelectElement;
    tabIndicator.style.left = `calc(calc(100% / ${this.tabs.length}) * ${this.currentTabIndex})`;
    tabIndicator.style.width = `calc(100% / ${this.tabs.length}))`;
    this.onChange.emit(x);
  }

}
