import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent {
  @Input() list = [{ text: '', click: '' }];

  setLink(list, time = 2000) {
    setTimeout(() => { this.list = list; }, time);
  }
}
