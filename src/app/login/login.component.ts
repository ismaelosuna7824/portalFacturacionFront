import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from './login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string = "";
  contrasena: string = "";
  constructor(private loginS: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.loginS.login(this.usuario, this.contrasena).then((resp:any)=>{
      //console.log(resp)
      if(resp.status){
        this.router.navigate(["/adm/emitidos"]);
        localStorage.setItem('token', resp.token);
      }else{
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'info',
          title: 'Usuario o contraseña son incorrectos'
        })
      }
    })
  }
}
