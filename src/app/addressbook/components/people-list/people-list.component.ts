
import { PeopleService } from '../../services/people.service';

import { tap, switchMap, filter } from 'rxjs/operators';
import { People } from '../../model/people.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { PeopleQuery } from '../../store/people.query';
import { PeopleState } from '../../store/people.store';

@Component({
  selector: 'app-people-list',
  templateUrl: 'people-list.component.html'
})
export class PeopleListComponent implements OnInit, OnDestroy {

  personToBeUpdated: People | any;
  isUpdateActivated = false;
  listPeopleSub: Subscription;
  deletePersonSub: Subscription;
  updatePersonSub: Subscription;
  Pstate: PeopleState;

  people$: Observable<People[]> = this.PeopleQuery.selectAll();


 addressBook:People[];

  constructor(private PeopleService: PeopleService, private PeopleQuery: PeopleQuery) {
  }

  ngOnInit() {
    this.listPeopleSub = this.PeopleQuery.selectArePeopleLoaded$.pipe(
      filter(arePeopleLoaded => !arePeopleLoaded),
      switchMap(arePeopleLoaded => {
        if(!arePeopleLoaded){
          return this.PeopleService.getAllPeople();
        }else return '';
      })
    ).subscribe(result => {});
  }

  getPeople() {
    this.PeopleService.getAllPeople().subscribe(
      people => {
        this.addressBook=people;
        console.log("load people over network, sad face..");
      }
    )
  }

  deletePerson(personId: string) {
    this.deletePersonSub = this.PeopleService.deletePerson(personId).subscribe(result => {
      console.log(result);
    });

  }

  showUpdateForm(person: People) {
    this.isUpdateActivated = true;
    this.personToBeUpdated = {...person};
  }


  updatePerson(updateForm: { value: People; }) {
    this.updatePersonSub = this.PeopleService.updatePerson(
      this.personToBeUpdated.id, updateForm.value).subscribe(result => console.log(result)

    );
    this.isUpdateActivated = false;
    this.personToBeUpdated = null;
  }

  ngOnDestroy() {
      if(this.listPeopleSub){
        this.listPeopleSub.unsubscribe();
      }
      if(this.deletePersonSub){
        this.deletePersonSub.unsubscribe();
      }
      if(this.updatePersonSub){
        this.updatePersonSub.unsubscribe();
      }
  }


}

