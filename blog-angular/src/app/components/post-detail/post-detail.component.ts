import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {
  public post:Post;
  public identity;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router,
    
  ) {
   
   }

  ngOnInit(): void {
    this.getPost();
  }


  getPost() {
    //sacar el id del post
    this._route.params.subscribe(
      params => {

        let id = +params.id;

        //peticion ajax para sacr los datos
        this._postService.getPost(id).subscribe(
          response => {
            if (response.status == 'success') {

              this.post = response.posts;
              console.log(this.post);

            } else {
              this._router.navigate(['/inicio']);
            }

          },
          error => {
            
            console.log(<any>error);
            this._router.navigate(['/inicio']);

          }
        );

      }
    );

  }

}
