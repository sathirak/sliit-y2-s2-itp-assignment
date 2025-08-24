import { OmitType } from '@nestjs/swagger';
import { CatDto } from 'src/modules/cats/dtos/cat.dto';

export class CreateCatDto  extends OmitType(CatDto, ['id', 'createdAt', 'isDeleted'] as const) {
  constructor(partial: CreateCatDto) {
    super();
    Object.assign(this, partial);
  }
}