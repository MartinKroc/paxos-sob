import {Pipe, PipeTransform} from '@angular/core';
import {Role} from "../models/role";

@Pipe({
  name: 'transformRole'
})
export class TransformRolePipe implements PipeTransform {

  transform(value: number): Role {
    switch (value) {
      case 0: {
        return Role.Leader
      }
      case 1: {
        return Role.Client
      }
      case 2: {
        return Role.Proposer
      }
      case 3: {
        return Role.Acceptor
      }
      case 4: {
        return Role.Learner
      }
      default: {
        return Role.Client
      }
    }
  }

}
