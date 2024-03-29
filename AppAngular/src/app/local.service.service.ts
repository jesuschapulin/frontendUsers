import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
/* se exporta el nombre del service para ser usado por un componente */

export class LocalServiceService {

  constructor(
    private http :HttpClient
  ){
  }
  getInfoFilters() { 
        var url='http://localhost:9999/service/getUsersADEA';
        return this.http.get<any>(url).toPromise()
      }
  getDataUser(data:any) { 
    var str=JSON.stringify(data);
    var dataUser=JSON.parse(str);
    var complement=""+dataUser.LOGIN
    var url='http://localhost:9999/service/getUserADEAByLogin/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByName(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.NOMBRE;
    var url='http://localhost:9999/service/getUsersADEAByName/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByStatus(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.STATUS;
    var url='http://localhost:9999/service/getUsersADEAByActive/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByDate(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.FECHA1+"/"+dataSearchUser.FECHA2;
    var url='http://localhost:9999/service/getUsersADEAByDate/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  sendUserRegister(data:any) { 
    var str=JSON.stringify(data);
    var dataRegister=JSON.parse(str);
    var complement=""+dataRegister.LOGIN+"/"+dataRegister.PASSWORD+"/"+dataRegister.NOMBRE+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.CLIENTE+"/"+dataRegister.FECHA_VIGENCIA;
    var url='http://localhost:9999/service/setOneUserADEA/'+complement;
    return axios.post(url);
  }
  sendUserUpdate(data:any) { 
    var str=JSON.stringify(data);
    var dataRegister=JSON.parse(str);
    var complement=""+dataRegister.LOGIN+"/"+dataRegister.NOMBRE+"/"+dataRegister.CLIENTE+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.STATUS+"/"+dataRegister.FECHA_VIGENCIA;
    var url='http://localhost:9999/service/alterUserADEA/'+complement;
    return axios.post(url);

  }
  validateAccessUser(data:any) { 
    var str=JSON.stringify(data);
    var dataAccessUser=JSON.parse(str);
    var complement=""+dataAccessUser.LOGIN+"/"+dataAccessUser.PASSWORD;
    var url='http://localhost:9999/service/getOneUserADEA/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  sendDeleteUser(data:any) { 
    var str=JSON.stringify(data);
    var dataDeleteUser=JSON.parse(str);
    var complement=""+dataDeleteUser.LOGIN+"/"+dataDeleteUser.NOMBRE;
    var url='http://localhost:9999/service/deleteUserADEA/'+complement;
    return axios.post(url);
  }
  sendInactiveUser(data:any) { 
    var str=JSON.stringify(data);
    var dataInactiveUser=JSON.parse(str);
    var complement=""+dataInactiveUser.LOGIN+"/"+dataInactiveUser.NOMBRE;
    var url='http://localhost:9999/service/inactiveUserADEA/'+complement;
    return axios.post(url);
  }
  getDataRedis() { 
    var url='http://localhost:9999/redisService/getPapers';
    return axios.get(url);
  }
}
