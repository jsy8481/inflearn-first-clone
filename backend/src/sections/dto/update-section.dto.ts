import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import CreateSectionDto from 'src/sections/dto/create-section.dto';

export default class UpdateSectionDto extends PartialType(CreateSectionDto) {
    @ApiProperty({
        description: '섹션 설명',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
    @ApiProperty({
        description: '섹션 순서',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    order?: number;
}
