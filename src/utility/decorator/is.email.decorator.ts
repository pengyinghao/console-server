import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { ruleHelper } from '../common/rule.helper';

function isEmail(value: string): boolean {
  const regex = ruleHelper.email;
  return regex.reg.test(value);
}

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isEmail(value);
        },
        defaultMessage(args: ValidationArguments) {
          if (validationOptions.message) {
            if (typeof validationOptions.message === 'function') return validationOptions.message(args);
            return validationOptions.message;
          }
          return ruleHelper.email.message;
        }
      }
    });
  };
}
