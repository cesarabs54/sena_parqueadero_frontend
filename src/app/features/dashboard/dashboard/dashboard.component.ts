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

  parkingLots = signal<any[]>([]);
  totalOccupancy = signal<number>(0);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadOccupancy();
  }

  loadOccupancy() {
    this.loading.set(true);
    this.parkingService.getAllParkingLots().subscribe({
      next: (lots) => {
        this.parkingLots.set(lots);
        const total = lots.reduce((acc, lot) => acc + (lot.occupied || 0), 0);
        this.totalOccupancy.set(total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching occupancy', err);
        this.loading.set(false);
      }
    });
  }

  getAvailabilityColor(capacity: number, occupied: number): string {
    const free = capacity - occupied;
    const percentageFree = (free / capacity) * 100;

    if (free === 0) return '#ef4444'; // Red (0 free)
    if (percentageFree < 25) return '#f97316'; // Orange (< 25% free)
    if (percentageFree < 50) return '#eab308'; // Yellow (25-50% free)
    return '#22c55e'; // Green (50-100% free)
  }

  getFreeSpaces(capacity: number, occupied: number): number {
    return capacity - occupied;
  }
}
