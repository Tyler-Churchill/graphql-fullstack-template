import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

export function IsUnique() {
  console.log('hey');
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: { validationError: { target: false, value: false } },
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(object);
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value.length > relatedValue.length
          );
        }
      }
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    console.log(userName);
    return false;
    // return UserRepository.findOneByName(userName).then(user => {
    //     if (user) return false;
    //     return true;
    // });
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint
    });
  };
}
