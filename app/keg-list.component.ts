import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Keg } from './models/keg.model';


@Component({
  selector: 'keg-list',
  template: `
    <div [class]="assignBackground(currentKeg)" *ngFor="let currentKeg of inventory | priceSorted">
      <div class="panel-heading" (click)="showDetails(currentKeg)">
        <button type="button" class="btn-lg align-right" *ngIf="currentKeg.pintsAreLow" disabled> <span class="glyphicon glyphicon-alert" aria-hidden="true"></span></button>
        <h2>{{currentKeg.name}} by {{currentKeg.brand}}</h2>
      </div>
      <div *ngIf="currentKeg.isBeingEdited == false">
        <div class="panel-body" *ngIf="currentKeg.isFocusBrew">
          <h4>Alcohol Content: {{currentKeg.alcoholContent}}%</h4> <h4>\${{currentKeg.salePrice}}/pint</h4>
          <h4>There are {{currentKeg.pintsLeft}} pints left in this keg</h4>
          <div *ngIf="isEmployee">
            <div class="col-sm-6">
              <div class="discount-panel">
                <h3>Discount this Beer</h3>
                <input type="number" (input)="currentKeg.modifyPrice($event.target.value)" min="1" max="99">
              </div>
            </div>
            <div class="col-sm-6">
              <sell-pint [currentKeg]="currentKeg"></sell-pint>
              <button type="button" class="btn btn-primary" (click)="toggleEditing(currentKeg)">Edit Keg</button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="currentKeg.isBeingEdited">
        <div class="panel-body">
          <edit-keg [currentKeg]="currentKeg" (clickSender)="sendDeleteMessage($event)">Loading</edit-keg>
          <button type="button" class="btn btn-primary" (click)="toggleEditing(currentKeg)">Finish Editing</button>
        </div>
      </div>
    </div>

  `
})

export class KegListComponent {
  @Input() isEmployee: boolean;
  @Output() deleteSender = new EventEmitter();

  inventory: Keg[] = Keg.inventory;

  showDetails(selectedKeg: Keg) {
    for(let individualKeg of this.inventory) {
      if(individualKeg.kegId !== selectedKeg.kegId){
          individualKeg.isFocusBrew = false;
      }
    }
    selectedKeg.isFocusBrew = (!(selectedKeg.isFocusBrew));
  }

  assignBackground(selectedKeg: Keg) {
    if(this.isEmployee) {
      if(selectedKeg.pintsLeft > 50) {
        return "panel panel-success";
      } else if (selectedKeg.pintsLeft > 10) {
        return "panel panel-warning";
      } else {
        return "panel panel-danger";
      }
    } else {
      return "panel panel-primary";
    }
  }

  toggleEditing(selectedKeg: Keg) {
    selectedKeg.isBeingEdited = (!(selectedKeg.isBeingEdited));
    console.log("toggles");
  }

  sendDeleteMessage(selectedKeg: Keg) {
    this.deleteSender.emit(selectedKeg);
  }
}
