import { Exclude, Transform } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for Cat
 */
export class CatDto {
  constructor(partial: CatDto) {
    Object.assign(this, partial);
  }

  /**
   * Unique identifier for the cat
   * @example "b7e8c2d1-4f3a-4c2a-9e2b-1a2b3c4d5e6f"
   * @type {string}
   * @memberof CatDto
   */
  @Exclude()
  @IsUUID()
  id: string;

  /**
   * Cat color
   * @example "black"
   * @type {string}
   * @memberof CatDto
   */
  @Exclude()
  @IsString()
  @IsOptional()
  color: string;

  /**
   * Cat name
   * @example "Whiskers"
   * @type {string}
   * @memberof CatDto
   */
  @IsString()
  name: string;

  /**
   * Date when the banner was created
   * @example "2023-01-01T00:00:00.000Z"
   * @type {Date}
   * @memberof CatDto
   */
  @Exclude()
  @IsDate()
  createdAt: Date;

  /**
   * Whether the banner is deleted
   * @example false
   * @type {boolean}
   * @memberof CatDto
   */
  @Exclude()
  @IsBoolean()
  isDeleted: boolean;
}
