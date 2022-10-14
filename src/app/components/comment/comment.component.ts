import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  comments: any[] = [];
   comment: any;
  @Input() postId: any;
  @Input() likes: number = 0;
  likeToggle: boolean = false;
  reply: boolean = false;
  ids: number[]=[];



  constructor(private postServ: PostService, private authServ: AuthService) { }

  ngOnInit(): void {
    this.getComments();
    this.isLiked();
  }

 async getComments(){
    let resp = await this.postServ.getCommentsByPost(this.postId);
    this.comments = resp;
  }

  isLiked(){
    for(const element of this.comments){
       if(element.parent_id == this.postId){
        this.comment = element.usersDto;
      this.ids = element.usersDto;
       }
    }

    if(this.ids.includes(this.authServ.loggedInUser.id)){
      this.likeToggle = true;
      return;
    } else {
      this.likeToggle = false;
    }

  }
  
 async Like(){

  if(this.authServ.loggedInUser){
    
  if(this.likeToggle == false){
    let resp = await this.postServ.LikePost(this.comment.id);
    if(resp){
      this.likeToggle = true;
      this.likes++;
    } else {
      alert("Like could not be made");
    }
  } else {
    this.takeAwayLike();
  }

} else {
  alert("You need to be logged in for like to work");
}
  }

  async takeAwayLike(){
    if(this.authServ.loggedInUser){

    if(this.likeToggle == true){
      let resp = await this.postServ.unLikePost(this.comment.id);
      if(resp){
        this.likeToggle = false;
        this.likes--;
      } else {
        alert("unlike could not be made");
      }
    } else {
      this.Like();
    }

  } else {
    alert("You need to be logged in for like to work");
  }
  }

  toggleReply(){
    this.reply = !this.reply;
  }
}
