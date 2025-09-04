import { Component } from '@angular/core';

@Component({
  selector: 'app-game-clock',
  template: `
    <div class="game-clock">
      <h2>Blue Prince Game Clock</h2>
      <div class="clock-display">{{ timeString }}</div>
      <div class="controls">
        <button (click)="start()" [disabled]="running">Start</button>
        <button (click)="stop()" [disabled]="!running">Stop</button>
        <button (click)="reset()">Reset</button>
      </div>
      <div class="day-widget" style="margin-top:2em;">
        <label for="dayInput">Day #:</label>
        <input id="dayInput" type="number" min="1" [(ngModel)]="dayNumber" (input)="updateDate()" style="width:4em;">
        <span *ngIf="dayNumber >= 1">Date: {{ dayDate }}</span>
      </div>
    </div>
  `,
  styles: [`
    .game-clock { text-align: center; margin: 2em auto; }
    .clock-display { font-size: 2em; margin: 1em 0; }
    .controls button { margin: 0 0.5em; }
  `]
})
export class GameClockComponent {
  dayNumber: number = 1;
  dayDate: string = '';
  private readonly startHour = 8;
  private readonly startMinute = 0;
  private readonly speed = 8; // 8x real time
  private timerId: any = null;
  private startTimestamp: number = 0;
  private elapsedMs: number = 0;
  running = false;
  timeString = '';

  constructor() {
    this.setTime(this.startHour, this.startMinute, 0);
    this.updateDate();
  }

  updateDate() {
    if (this.dayNumber >= 1) {
      const baseDate = new Date(1993, 10, 7); // Months are 0-indexed: 10 = November
      const resultDate = new Date(baseDate.getTime() + (this.dayNumber - 1) * 24 * 60 * 60 * 1000);
      this.dayDate = resultDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } else {
      this.dayDate = '';
    }
  }
  
  private setTime(hour: number, minute: number, second: number) {
    this.timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  }
  
  private getCurrentGameTime(): { hour: number, minute: number, second: number } {
    const totalMs = this.elapsedMs;
    const totalSeconds = Math.floor(totalMs / 1000) * this.speed;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hour = (this.startHour + Math.floor(totalMinutes / 60)) % 24;
    const minute = (this.startMinute + totalMinutes % 60) % 60;
    const second = totalSeconds % 60;
    return { hour, minute, second };
  }


  private updateClock() {
    if (this.running) {
      const now = Date.now();
      this.elapsedMs += now - this.startTimestamp;
      this.startTimestamp = now;
  const { hour, minute, second } = this.getCurrentGameTime();
  this.setTime(hour, minute, second);
    }
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.startTimestamp = Date.now();
      this.timerId = setInterval(() => this.updateClock(), 1000);
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  reset() {
    this.stop();
    this.elapsedMs = 0;
  this.setTime(this.startHour, this.startMinute, 0);
  }
}
