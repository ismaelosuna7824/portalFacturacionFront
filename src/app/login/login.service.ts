import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loading: boolean;
  posts: any;
  private querySubscription: Subscription;
  constructor(private apollo: Apollo) { }
  login(usuario: string, contrasena:string){
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
      query login($usuario: String, $contrasena: String){
        login(usuario: $usuario, contrasena: $contrasena){
          status
          token
        }
      }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "usuario": `${usuario}`,
        "contrasena": `${contrasena}`
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.login;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }
}
