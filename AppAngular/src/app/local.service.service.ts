import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
/* se exporta el nombre del service para ser usado por un componente */

export class LocalServiceService {
  local="http://localhost:9999/service/";
  dominio="https://node150639-env-9117163.fr-1.paas.massivegrid.net/service/";
  constructor(
    private http :HttpClient
  ){
  }
  getInfoFilters() { 
        var url=this.dominio+'getUsersADEA';
        return this.http.get<any>(url).toPromise()
      }
  getDataUser(data:any) { 
    var str=JSON.stringify(data);
    var dataUser=JSON.parse(str);
    var complement=""+dataUser.LOGIN
    var url=this.dominio+'getUserADEAByLogin/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByName(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.NOMBRE;
    var url=this.dominio+'getUsersADEAByName/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByStatus(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.STATUS;
    var url=this.dominio+'getUsersADEAByActive/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  getDataUsersByDate(data:any) { 
    var str=JSON.stringify(data);
    var dataSearchUser=JSON.parse(str);
    var complement=""+dataSearchUser.FECHA1+"/"+dataSearchUser.FECHA2;
    var url=this.dominio+'getUsersADEAByDate/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  sendUserRegister(data:any) { 
    var str=JSON.stringify(data);
    var dataRegister=JSON.parse(str);
    var complement=""+dataRegister.LOGIN+"/"+dataRegister.PASSWORD+"/"+dataRegister.NOMBRE+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.CLIENTE+"/"+dataRegister.FECHA_VIGENCIA;
    var url=this.dominio+'setOneUserADEA/'+complement;
    return axios.post(url);
  }
  sendUserUpdate(data:any) { 
    var str=JSON.stringify(data);
    var dataRegister=JSON.parse(str);
    var complement=""+dataRegister.LOGIN+"/"+dataRegister.NOMBRE+"/"+dataRegister.CLIENTE+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.APELLIDO_PATERNO+"/"+dataRegister.STATUS+"/"+dataRegister.FECHA_VIGENCIA;
    var url=this.dominio+'alterUserADEA/'+complement;
    return axios.post(url);

  }
  validateAccessUser(data:any) { 
    var str=JSON.stringify(data);
    var dataAccessUser=JSON.parse(str);
    var complement=""+dataAccessUser.LOGIN+"/"+dataAccessUser.PASSWORD;
    var url=this.dominio+'getOneUserADEA/'+complement;
    return this.http.get<any>(url).toPromise()
  }
  sendDeleteUser(data:any) { 
    var str=JSON.stringify(data);
    var dataDeleteUser=JSON.parse(str);
    var complement=""+dataDeleteUser.LOGIN+"/"+dataDeleteUser.NOMBRE;
    var url=this.dominio+'deleteUserADEA/'+complement;
    return axios.post(url);
  }
  sendInactiveUser(data:any) { 
    var str=JSON.stringify(data);
    var dataInactiveUser=JSON.parse(str);
    var complement=""+dataInactiveUser.LOGIN+"/"+dataInactiveUser.NOMBRE;
    var url=this.dominio+'inactiveUserADEA/'+complement;
    return axios.post(url);
  }
  getDataRedis() { 
    var url='http://localhost:9999/redisService/getPapers';
    return axios.get(url);
  }
}
