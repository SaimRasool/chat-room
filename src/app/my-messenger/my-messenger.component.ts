import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChannelVM } from '../models/channelVM';
import { MessengerService } from '../services/messenger.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { UserVM } from '../models/usersVM';
import { ChannelMessageVM } from '../models/channelMessageVM';

@Component({
  selector: 'app-my-messenger',
  templateUrl: './my-messenger.component.html',
  styleUrls: ['./my-messenger.component.css']
})
export class MyMessengerComponent implements OnChanges, OnInit  {
isMenuVisible = false;
user: UserVM =new UserVM();
@Input() channel: ChannelVM | undefined;
channelMessages:ChannelMessageVM[]=[];
displayMessagesList:any[]=[];
participantList:any[]=[];
currentPage:number=1;
pageSize:number=10;
isChannelParticipants:boolean=false;
textareaValue: string = '';
 constructor(private messengerService: MessengerService,
            private accountService: UserService,
            private alertService: AlertService            ) {
              this.accountService.user.subscribe(x => this.user = x);
  }
  ngOnInit() {
    }
 
  async ngOnChanges(changes: SimpleChanges) {
    if(this.channel?.channelId!>0)
    {
      await this.loadChannelparticipant();
      this.getAllChannelMessages(false);
          this.currentPage=1

    }
  }
  toggle()
  {
    this.isMenuVisible = !this.isMenuVisible;
  }  
   async loadChannelparticipant() {
     this.alertService.clear();
     await this.messengerService.getChannelParticipants(this.channel?.channelId!).toPromise().then(data => {
       this.participantList=data
       this.isChannelParticipants=true;
     },
       error => {
         this.alertService.error(error);
      });          
 }


addMessage()
{
    var msg: ChannelMessageVM=new ChannelMessageVM();
    msg.messageContent=this.textareaValue;
    msg.channelId=this.channel?.channelId;
    msg.isSeen=false;
    msg.messageDate=new Date();
    msg.senderID=this.user.userId;
   this.messengerService.addCahnelMessage(msg).subscribe(data => {
     if(data.res)
     {
       this.getNewChannelMessages();
     }
     console.log(data);  
  },
   error => {
     this.alertService.error(error);
   });
   this.textareaValue="";
 }


@HostListener('scroll', ['$event'])
onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
}
else if(event.target.scrollTop===0 && this.currentPage>=1){
  if(this.isChannelParticipants)
  {
    this.currentPage++;
    this.getAllChannelMessages(true);
  }
}
}
moveScrollToBottom() {
  setTimeout(function () {
    let element = document.getElementById("messages-flow") as HTMLDivElement;
    if(element!=undefined && element!=null)
    element.scrollTop = element.scrollHeight;
  }, 2);
}
moveScrollToElement(elementId:any) {
  setTimeout(function () {
    let element = document.getElementById(elementId) as HTMLDivElement;
    if(element!=undefined && element!=null)
    element.scrollIntoView();
  }, 2);
}
    
    async getAllChannelMessages(olderMessages:boolean=false)  {
    let lastChannelMessage : number=0;
    if(this.currentPage === 1)
    {
      this.displayMessagesList=[] as ChannelMessageVM[];
    }
    else{
      if(this.displayMessagesList.length>0)
        lastChannelMessage= this.displayMessagesList[0].channelMessageId;
    }
    await this.messengerService.getChannelMessages(this.channel?.channelId!, this.currentPage, this.pageSize)
    .toPromise()
     .then(response => {
     if (response.length == 0) {
              return;
            }
            if(olderMessages)
            {
              response.forEach((element:any)=>{
                    const user=this.participantList.find( (cp:any)=> cp.userId==element.senderID); 
                   if(element.senderId==this.user.userId)
                    element.isSelf=true;
                this.displayMessagesList.unshift({
                 ...element,
                 ...user
                });
               });
               this.moveScrollToElement("dvmessage_"+lastChannelMessage);
            }
            else
            {
              response.reverse().forEach((element:any)=>{
              const user=this.participantList.find( (cp:any)=> cp.userId==element.senderID); 
                if(element.senderId==this.user.userId)
                    element.isSelf=true;
                this.displayMessagesList.push({
                  ...element,
                  ...user
                 });
               });
               this.moveScrollToBottom();
            }
          }
            ,
            (error: any) => {
              this.alertService.error(error);
            });
  }
   insertNewLine(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      // Prevent the default behavior of Enter key
      event.preventDefault();
    }
  }
  getNewChannelMessages()  {
    let lastChannelMessage : number=0;
    if(this.displayMessagesList.length>0)
      lastChannelMessage= this.displayMessagesList[this.displayMessagesList.length-1].channelMessageId;
    this.messengerService.getNewChannelMessages(this.channel?.channelId!, lastChannelMessage)
    .toPromise()
     .then((response:any) => {
     if (response!.length == 0) {
              return;
            }
              response.forEach((element:any)=>{
                    const user=this.participantList.find( (cp:any)=> cp.userId==element.senderID); 
                if(element.senderId==this.user.userId)
                    element.isSelf=true;
                  this.displayMessagesList.push({
                   ...element,
                   ...user
                  });
               });
               this.moveScrollToElement("dvmessage_"+lastChannelMessage);
          }
            ,
            (error: any) => {
                 this.alertService.error(error);

            });
  }

 
}
