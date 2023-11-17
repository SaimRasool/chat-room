import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { UserVM } from '../models/usersVM';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { ChannelVM } from '../models/channelVM';
import { ChannelParticipantVM } from '../models/channelParticipantVM';

@Component({
  selector: 'app-messenger-list',
  templateUrl: './messenger-list.component.html',
  styleUrls: ['./messenger-list.component.css']
})
export class MessengerListComponent implements  OnInit {
    user: UserVM =new UserVM();
    channelList:any[]=[];
    selecteChannel: ChannelVM=new ChannelVM();
    logedInUserChannelIds: number[]=[];
 constructor(private messengerService: MessengerService,
            private accountService: UserService,
            private alertService: AlertService
            ) {
              this.accountService.user.subscribe(x => this.user = x);
  }
  async ngOnInit() {
    if(this.user)
    {
     await this.getUserChannelIds();  
    }
           
  }

async getUserChannelIds() {
        this.alertService.clear();
        await this.messengerService.getUserChannels(this.user.userId!).toPromise().then(data => {
         const channelParticipants=data
         this.logedInUserChannelIds= channelParticipants.map((cp:ChannelParticipantVM) => cp.channelId);
         if(this.logedInUserChannelIds.length>0)
          {
            this.loadAllChannel();
           }       
        },
          error => {
            this.alertService.error(error);
          });
    }
loadAllChannel() {
        this.alertService.clear();
        if(this.logedInUserChannelIds.length>0)
        this.messengerService.getAllChannels(this.logedInUserChannelIds).subscribe(data => {
        this.channelList=data;     
        for(var ch of this.channelList)
        {
          var cp=ch.children.find((cp:any)=>cp.userId!=this.user.userId);
          ch.channelName=cp.userName;
          ch.image=cp.image;
        }
        },
          error => {
            this.alertService.error(error);
          });
    }
    

selectedChannel(channel:ChannelVM) {
  this.channelList=this.channelList.map((ch)=> {
    if (ch.channelId == channel.channelId) {
        return { ...ch, isActive: true }; 
    }
    return  { ...ch, isActive: false }; 
  })
  this.selecteChannel=channel;       
}

}