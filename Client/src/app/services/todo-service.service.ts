import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RequestOptions} from '@angular/http';

const FETCH_TODO_LIST_ITEMS = '/api/getToDoListItems';
const CREATE_TODO_LIST_ITEMS  = '/api/createToDoListItem';
const UPDATE_TODO_LIST_ITEM = '/api/updateTodoListItem/{:id}';
const DELETE_TODO_LIST_ITEM = '/api/deleteToDoListItem/{:id}';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private httpClient: HttpClient) { }


  public getAllTodoListItems(): any {
    return this.httpClient.get( environment.gateway + FETCH_TODO_LIST_ITEMS)
      .toPromise()
      .then();
  }

  public createNewTodoListItem(newTodoListItemDetail) {
    var url = environment.gateway + CREATE_TODO_LIST_ITEMS;

    let headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8').append('Authorization', 'Bearer');

    // let options = new RequestOptions({headers: headers});

  let  options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let body = JSON.stringify(newTodoListItemDetail);

    return this.httpClient.post(url, body, options)
      .toPromise().then();
  }

  public updateTodoListItem(newTodoListItemValue, id) {
    var url = environment.gateway + UPDATE_TODO_LIST_ITEM.split('{:id}').join(id);

    let headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8').append('Authorization', 'Bearer');

   //  let options = new RequestOptions({headers: headers});

    let  options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let body = JSON.stringify(newTodoListItemValue);

    return this.httpClient.put(url, body, options)
      .toPromise().then();
  }

  public deleteToDoListItem(id) {
    var url = environment.gateway + DELETE_TODO_LIST_ITEM.split('{:id}').join(id);

    return this.httpClient.delete(url)
      .toPromise();
  }
}
