import { Component, Input } from '@angular/core';
import { IRankedItem } from '../../../core/models/report.model';

@Component({
  imports: [],
  selector: 'app-ranked-list',
  styleUrl: './rankedlist.css',
  templateUrl: './rankedlist.html',
})
export class RankedList {
  @Input() title!: string;
  @Input() items: IRankedItem[] = [];
}
