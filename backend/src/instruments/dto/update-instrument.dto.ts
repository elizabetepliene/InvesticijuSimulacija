import { PartialType } from '@nestjs/mapped-types';
import { CreateInstrumentDto } from './create-instrument.dto.js';

export class UpdateInstrumentDto extends PartialType(CreateInstrumentDto) {}
