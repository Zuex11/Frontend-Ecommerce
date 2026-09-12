import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-stat-card',
  styleUrl: './statcard.css',
  templateUrl: './statcard.html',
})
export class StatCard {
  @Input() label!: string;
  @Input() value!: string | number;
}
