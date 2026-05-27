import { Component, Inject, signal, inject, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideX, LucideCheck, LucideTrash2 } from '@lucide/angular';
import { CommitRecordFormComponent } from './commit-record-form.component';
import { UserRecordsService } from '../../../../core/service/user/user-records.service';
import { Record } from '../../../../core/model/record.model';

export type CommitRecordSheetData = Record;

@Component({
  selector: 'app-commit-record-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    LucideX,
    LucideCheck,
    LucideTrash2,
    CommitRecordFormComponent,
  ],
  styles: [`
    :host { display: block; width: 100%; }

    .sheet-container {
      padding: 12px 16px 28px;
      display: flex;
      flex-direction: column;
      width: 100%;
      box-sizing: border-box;
    }

    .drag-handle {
      width: 36px;
      height: 4px;
      background: var(--bw-border-strong);
      border-radius: 2px;
      margin: 0 auto 14px;
    }

    .sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .header-eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--bw-ink-3);
      margin-bottom: 3px;
    }

    .header-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0;
      color: var(--bw-ink);
    }

    .close-btn {
      all: unset;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: var(--bw-elevated);
      color: var(--bw-ink);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }

    .close-btn:hover { background: var(--bw-sunken); }

    .sheet-body { flex: 1; }

    .sheet-footer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--bw-border);
    }

    .footer-row {
      display: flex;
      gap: 8px;
    }

    .btn {
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      padding: 13px 16px;
    }

    .btn:active:not(:disabled) { transform: scale(0.98); }

    .btn-primary {
      background: var(--bw-emerald);
      color: var(--bw-on-ink);
      flex: 1;
    }

    .btn-primary:not(:disabled):hover { opacity: 0.9; }
    .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

    .btn-cancel {
      background: transparent;
      color: var(--bw-ink-2);
      border: 1.5px solid var(--bw-border);
      flex: 1;
    }

    .btn-cancel:hover { background: var(--bw-sunken); }

    .btn-delete {
      width: 100%;
      background: transparent;
      color: var(--bw-red);
      border: 1.5px solid var(--bw-red-soft);
      font-size: 13px;
    }

    .btn-delete:hover { background: var(--bw-red-soft); }
  `],
  template: `
    <div class="sheet-container">
      <div class="drag-handle"></div>

      <div class="sheet-header">
        <div>
          <div class="header-eyebrow">Konfirmasi transaksi</div>
          <h2 class="header-title">Tinjau & konfirmasi</h2>
        </div>
        <button class="close-btn" (click)="bottomSheetRef.dismiss()">
          <svg lucideX class="w-3.5 h-3.5"></svg>
        </button>
      </div>

      <div class="sheet-body">
        <app-commit-record-form [record]="data" #formComponent />
      </div>

      <div class="sheet-footer">
        <div class="footer-row">
          <button type="button" class="btn btn-cancel" (click)="bottomSheetRef.dismiss()">
            Batal
          </button>
          <button type="button" class="btn btn-primary"
                  [disabled]="submitting()"
                  (click)="submit()">
            <svg lucideCheck class="w-4 h-4"></svg>
            {{ submitting() ? 'Menyimpan...' : 'Konfirmasi' }}
          </button>
        </div>
        <button type="button" class="btn btn-delete"
                [disabled]="submitting()"
                (click)="confirmDelete()">
          <svg lucideTrash2 class="w-3.5 h-3.5"></svg>
          Hapus transaksi
        </button>
      </div>
    </div>
  `,
})
export class CommitRecordSheetComponent {
  @ViewChild('formComponent') form!: CommitRecordFormComponent;

  private recordsService = inject(UserRecordsService);
  private snackBar = inject(MatSnackBar);
  submitting = signal(false);

  constructor(
    public bottomSheetRef: MatBottomSheetRef<CommitRecordSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CommitRecordSheetData,
  ) {}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      if (!this.submitting()) this.submit();
    }
    if (event.key === 'Escape') {
      this.bottomSheetRef.dismiss();
    }
  }

  async submit() {
    this.submitting.set(true);
    try {
      const changedCategory = this.form.getCategoryOrUndefined();
      await this.recordsService.commitRecord(this.data.id, changedCategory);
      this.snackBar.open('Transaksi berhasil dikonfirmasi ✓', 'Tutup', { duration: 2500 });
      this.bottomSheetRef.dismiss('committed');
    } catch {
      this.snackBar.open('Gagal mengonfirmasi transaksi. Coba lagi.', 'Tutup', { duration: 3000 });
    } finally {
      this.submitting.set(false);
    }
  }

  confirmDelete() {
    const snackRef = this.snackBar.open('Hapus transaksi ini?', 'Ya, hapus', { duration: 5000 });
    snackRef.onAction().subscribe(() => this.doDelete());
  }

  private async doDelete() {
    this.submitting.set(true);
    try {
      await this.recordsService.deleteRecord(this.data.id);
      this.snackBar.open('Transaksi dihapus.', 'Tutup', { duration: 2000 });
      this.bottomSheetRef.dismiss('deleted');
    } catch {
      this.snackBar.open('Gagal menghapus transaksi.', 'Tutup', { duration: 3000 });
    } finally {
      this.submitting.set(false);
    }
  }
}
