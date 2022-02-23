
import { PeopleService } from '../../services/people.service';
import { People } from '../../model/people.model';
import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PeopleStore } from '../../store/people.store';

@Component({
  selector: 'app-create-person',
  templateUrl: 'create-person.component.html'
})
export class CreatePersonComponent  {

  createPersonSub: Subscription;

  constructor(private peopleService: PeopleService, private router: Router, private store:PeopleStore) { }


  onSubmit(submittedForm: { value: { LastName: any; FirstName: any; Phone: any; }; invalid: any; }) {
    if (submittedForm.invalid) {
      return;
    }
    const people: People = {id: uuid.v4(), LastName: submittedForm.value.LastName,FirstName: submittedForm.value.FirstName, Phone: submittedForm.value.Phone};
    this.createPersonSub = this.peopleService.createPerson(people).subscribe(result => {
      this.router.navigateByUrl('/people');
    });
  }
}