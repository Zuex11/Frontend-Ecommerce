import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report-service';
import { IDashboardReport } from '../../core/models/report.model';
import { IRankedItem } from '../../core/models/report.model';
import { Subscription } from 'rxjs';
import { StatCard } from './statcard/statcard';
import { RankedList } from './rankedlist/rankedlist';

@Component({
  imports: [StatCard, RankedList],
  selector: 'app-admin-dashboard',
  styleUrl: './admindashboard.css',
  templateUrl: './admindashboard.html',
})
export class AdminDashboard implements OnInit, OnDestroy {
  constructor(
    private _reportService: ReportService,
    private _cdr: ChangeDetectorRef,
  ) {}
  myReport?: IDashboardReport;
  myTopProducts: IRankedItem[] = [];
  myTopCustomers: IRankedItem[] = [];
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const reportSub = this._reportService.getDashboardReport().subscribe({
      next: (res) => {
        this.myReport = res.data;
        this.myTopProducts = res.data.topProducts.map((product) => ({
          name: product.name,
          value: `${product.sold} sold`,
        }));
        this.myTopCustomers = res.data.topCustomers.map((customer) => ({
          name: customer.name,
          value: `LE ${customer.totalSpent}`,
        }));
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(reportSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
