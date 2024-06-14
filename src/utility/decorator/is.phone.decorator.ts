import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { ruleHelper } from '../common/rule.helper';

function isMobilePhone(value: string): boolean {
  const regex = ruleHelper.phone;
  return regex.reg.test(value);
}

export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMobilePhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isMobilePhone(value);
        },
        defaultMessage(args: ValidationArguments) {
          if (validationOptions.message) {
            if (typeof validationOptions.message === 'function') return validationOptions.message(args);
            return validationOptions.message;
          }
          return ruleHelper.phone.message;
        }
      }
    });
  };
}
