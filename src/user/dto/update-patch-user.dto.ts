import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

// PartialType need to be installed by npm i @nestjs/mapped-types
// PaertialTypes is used to send datas optinals and follow a rules already done
export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {}
