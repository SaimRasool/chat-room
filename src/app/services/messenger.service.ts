import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelVM } from '../models/channelVM';
import { Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { ChannelMessageVM } from '../models/channelMessageVM';
import { ChannelParticipantVM } from '../models/channelParticipantVM';
import { UserService } from './user.service';
import { UserVM } from '../models/usersVM';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  private apiUrl = 'http://localhost:3000'; // Update with your Node.js server address
  private channelUrl: string = '/assets/channel.json';
  private channelParticipantUrl: string = '/assets/channelParticipant.json';
  private url: string = '/assets/user.json'
  constructor(private http: HttpClient,private userService: UserService) { }

public getAllChannels(channelIds: number[]): Observable<any> {

  return forkJoin([
      this.http.get<any[]>(this.channelUrl),
      this.getChannelParticipantsByChannelIds(channelIds)
    ]).pipe(
      map((response: any) => {
        const [parentData, childData] = response;
        const joinedData = this.JoinChannelWithParticipant( parentData.filter((channel : ChannelVM) => channelIds.includes(channel.channelId!)), childData);
        return joinedData
      }),
    catchError(error => {
      console.error('Error occurred: ', error);
      return error;
    }));
  }

  // getChannel(channelId:any) : Observable<any> {
  //    return this.http.get<any[]>(this.channelUrl).pipe(
  //     map((response: any) => {
  //       const channel = response.find((u : ChannelVM) => u.channelId == channelId);
  //       if (channel) {
  //         return channel;
  //       } else {
  //         throw new Error('No Channel Exist');
  //       }
  //     }),
  //   catchError(error => {
  //     return error;
  //   }));
  //   }

  addCahnel(data: any) {
    this.http.post(this.apiUrl+'/addChannel', data).subscribe(
      (response) => {
        console.log('Data saved on the server:', response);
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
  addCahnelMessage(data: any) {
     return  this.http.post(this.apiUrl+'/addMessage', data).pipe(
      map((response: any) => {
          return response;
      }),
    catchError(error => {
      console.error('Error occurred: ', error);
      return error;
    }));
  }
  public getChannelMessages(channelId:number,currentPage:number,pageSize:number): Observable<any> {
  const url: string = '/assets/channelMessage.json';
  return this.http.get<any[]>(url).pipe(
      map((response: any) => {
          const channelMessages = Array.from(response.filter((u : ChannelMessageVM) => u.channelId == channelId));
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const reversedMessages = channelMessages.reverse();
        // Return paginated messages
        return reversedMessages.slice(startIndex, endIndex);
      }),
    catchError(error => {
      console.error('Error occurred: ', error);
      return error;
    }));
  }
  public getNewChannelMessages(channelId:number,lastChannelMessageId:number): Observable<any> {
  const url: string = '/assets/channelMessage.json';
  return this.http.get<any[]>(url).pipe(
      map((response: any) => {
          const channelMessages = Array.from(response.filter((u : ChannelMessageVM) => u.channelId == channelId));
          const lastIndex = channelMessages.findIndex((u : any)  => u.channelMessageId === lastChannelMessageId);

          if (lastIndex === -1) {
        return channelMessages.reverse();
      }

      // Return only new messages after lastChannelMessageId
      return channelMessages.slice(lastIndex + 1).reverse();
        // Return paginated messages
      }),
    catchError(error => {
      console.error('Error occurred: ', error);
      return error;
    }));
  }
 getUserChannels(userId:any) : Observable<any> {
     return this.http.get<any[]>(this.channelParticipantUrl).pipe(
      map((response: any) => {
        const channel = response.filter((u : ChannelParticipantVM) => u.userId == userId);
        if (channel) {
          return channel;
        } else {
          throw new Error('No User Exist');
        }
      }),
    catchError(error => {
      return error;
    }));
    }

     getChannelParticipants(channelId:any) : Observable<any> {
     return this.http.get<any[]>(this.channelParticipantUrl).pipe(
      switchMap((response: any) => {
        const channelParticipant = response.filter((u : ChannelParticipantVM) => u.channelId == channelId);
        let userIds=channelParticipant.map((cp:ChannelParticipantVM) => cp.userId!);
          return this.userService.getUsersByUserIds(userIds).pipe(
          map((file2Data: any) => {
            const joinedData = this.JoinOnParticipantAndUser(channelParticipant, file2Data);
            return joinedData;
          }));
      }),
    catchError(error => {
      return error;
    }));
    }
     getChannelParticipantsByChannelIds(channelIds: number[]) : Observable<any> {
     return this.http.get<ChannelParticipantVM[]>(this.channelParticipantUrl).pipe(
      switchMap((response: ChannelParticipantVM[]) => {
        let channelParticipant = response.filter((cp : ChannelParticipantVM) => channelIds.includes(cp.channelId!));
        let userIds=channelParticipant.map((cp:ChannelParticipantVM) => cp.userId!);
        userIds=[...new Set(userIds)];
        return this.userService.getUsersByUserIds(userIds).pipe(
          map((file2Data: any) => {
            const joinedData = this.JoinOnParticipantAndUser(channelParticipant, file2Data);
            return joinedData;
          })
        );
      }),
    catchError(error => {
      return error;
    }));
    }














//#region private Method
    private JoinOnParticipantAndUser(data1: any[], data2: any[]): any[] {
    return data1.map(item1 => {
      const matchingItem = data2.find(item2 => item1.userId === item2.userId);
      if (matchingItem) {
        return { ...item1, ...matchingItem };   
      }
      return item1;
    });
  }
   private JoinChannelWithParticipant(parents: any[], children: any[]): any[] {
    // Assuming 'parentId' in children matches 'id' in parents
    return parents.map(parent => {
      const matchingChildren = children.filter(child => child.channelId === parent.channelId);
      if (matchingChildren.length > 0) {
        parent.children = matchingChildren;
      }
      return parent;
    });
  }

    private  performJoin(data1: any[], data2: any[]): any[] {
    // Perform the join operation here using a common key
    // For example, if 'id' is the common key
    return data1.map(item1 => {
      const matchingItem = data2.find(item2 => item1.id === item2.id);
      if (matchingItem) {
        return { ...item1, ...matchingItem };
      }
      return item1;
    });
  }

  //#endregion
}
