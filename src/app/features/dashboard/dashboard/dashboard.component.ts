import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {KnobModule} from 'primeng/knob';
import {ParkingService} from '../../../infrastructure/adapters/parking.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, KnobModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private parkingService = inject(ParkingService);

  // Hardcoded ID for MVP, pending "Select Parking Lot" feature
  parkingLotId = '47184205-c9fc-43cb-bb68-ec379430c000';

  occupancy = signal<number>(0);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadOccupancy();
  }

  loadOccupancy() {
    this.loading.set(true);
    this.parkingService.getOccupancy(this.parkingLotId).subscribe({
      next: (count) => {
        this.occupancy.set(count);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching occupancy', err);
        this.loading.set(false);
      }
    });
  }
}
