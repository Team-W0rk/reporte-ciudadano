import { IsOptional } from 'class-validator';

export class EmptyBodyDto {
  @IsOptional()
  private readonly _vacio?: never;
}
