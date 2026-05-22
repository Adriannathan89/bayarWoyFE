import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend, FriendService } from '../../core/service/friend/friend.service';
import { FriendRequest, FriendRequestService } from '../../core/service/friend/friend-request.service';
import { Debt } from '../../core/model/debt.model';
import { DebtService } from '../../core/service/debt/debt.service';
import { FriendsDesktopComponent } from './component/friends-desktop.component';
import { FriendsMobileComponent } from './component/friends-mobile.component';

export type FriendWithBalance = {
  friend: Friend;
  owedToMe: number;
  iOwe: number;
  balance: number;
};

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [FriendsDesktopComponent, FriendsMobileComponent],
  template: `
    <app-friends-desktop
      [filteredFriends]="filteredFriends()"
      [pendingRequests]="pendingRequests()"
      [searchQuery]="searchQuery()"
      [activeTab]="activeTab()"
      [totalOwedToMe]="totalOwedToMe()"
      [totalIOwe]="totalIOwe()"
      [netBalance]="netBalance()"
      (searchChange)="searchQuery.set($event)"
      (tabChange)="activeTab.set($event)"
      (accept)="onAccept($event)"
      (reject)="onReject($event)"
    />
    <app-friends-mobile
      [filteredFriends]="filteredFriends()"
      [pendingRequests]="pendingRequests()"
      [searchQuery]="searchQuery()"
      [totalOwedToMe]="totalOwedToMe()"
      [totalIOwe]="totalIOwe()"
      [netBalance]="netBalance()"
      (searchChange)="searchQuery.set($event)"
      (accept)="onAccept($event)"
      (reject)="onReject($event)"
    />
  `,
})
export class FriendsPage implements OnInit {
  private friendService = inject(FriendService);
  private friendRequestService = inject(FriendRequestService);
  private debtService = inject(DebtService);
  private snackBar = inject(MatSnackBar);

  friends = signal<Friend[]>([]);
  myDebts = signal<Debt[]>([]);
  owedDebts = signal<Debt[]>([]);
  pendingRequests = signal<FriendRequest[]>([]);
  searchQuery = signal('');
  activeTab = signal<'friends' | 'requests'>('friends');

  friendsWithBalance = computed<FriendWithBalance[]>(() =>
    this.friends().map(f => {
      const owedToMe = this.myDebts()
        .filter(d => d.debtorId === f.id && d.status === 'pending')
        .reduce((sum, d) => sum + d.amount, 0);
      const iOwe = this.owedDebts()
        .filter(d => d.ownerId === f.id)
        .reduce((sum, d) => sum + d.amount, 0);
      return { friend: f, owedToMe, iOwe, balance: owedToMe - iOwe };
    })
  );

  filteredFriends = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q
      ? this.friendsWithBalance().filter(fw =>
          fw.friend.username.toLowerCase().includes(q)
        )
      : this.friendsWithBalance();
  });

  totalOwedToMe = computed(() =>
    this.friendsWithBalance().reduce((s, fw) => s + fw.owedToMe, 0)
  );

  totalIOwe = computed(() =>
    this.friendsWithBalance().reduce((s, fw) => s + fw.iOwe, 0)
  );

  netBalance = computed(() => this.totalOwedToMe() - this.totalIOwe());

  async ngOnInit() {
    try {
      const [friends, myDebts, owedDebts, requests] = await Promise.all([
        this.friendService.getFriend(),
        this.debtService.loadAllDebts(),
        this.debtService.loadOwedDebts(),
        this.friendRequestService.getFriendsRequest(),
      ]);
      this.friends.set(friends);
      this.myDebts.set(myDebts.filter(d => d.status === 'pending'));
      this.owedDebts.set(owedDebts);
      this.pendingRequests.set(requests);
    } catch {
      this.snackBar.open('Gagal memuat data teman.', 'Tutup', { duration: 3000 });
    }
  }

  async onAccept(requestId: string) {
    try {
      await this.friendRequestService.responseFriendRequest(requestId, 'accept');
      this.pendingRequests.update(reqs => reqs.filter(r => r.id !== requestId));
      const friends = await this.friendService.getFriend();
      this.friends.set(friends);
      this.snackBar.open('Permintaan pertemanan diterima.', 'Tutup', { duration: 3000 });
    } catch {
      this.snackBar.open('Gagal menerima permintaan.', 'Tutup', { duration: 3000 });
    }
  }

  async onReject(requestId: string) {
    try {
      await this.friendRequestService.responseFriendRequest(requestId, 'reject');
      this.pendingRequests.update(reqs => reqs.filter(r => r.id !== requestId));
      this.snackBar.open('Permintaan pertemanan ditolak.', 'Tutup', { duration: 3000 });
    } catch {
      this.snackBar.open('Gagal menolak permintaan.', 'Tutup', { duration: 3000 });
    }
  }
}
