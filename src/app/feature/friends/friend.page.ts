import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { SearchFriendComponent } from "../../shared/search-friend.component";

@Component({
    standalone: true,
    imports: [HeaderComponent, SearchFriendComponent],
    template: `
        <app-header></app-header>
        <div class="flex flex-col mt-[40px]">
            <app-search-friend></app-search-friend>
        </div>
    `
})
export class FriendPage {}