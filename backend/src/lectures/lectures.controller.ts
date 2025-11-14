import {
    Body,
    Controller,
    Get,
    Param,
    Delete,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LecturesService } from './lectures.service';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import CreateLectureDto from 'src/lectures/dto/create-lecture.dto';
import { Lecture as LectureEntity } from 'src/_gen/prisma-class/lecture';
import type { Request } from 'express';
import UpdateLectureDto from 'src/lectures/dto/update-lecture.dto';

@ApiTags('개별 강의')
@Controller('lectures')
export class LecturesController {
    constructor(private readonly lecturesService: LecturesService) {}

    @Post('sections/:sectionId/lectures')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '강의 생성' })
    @ApiParam({ name: 'sectionId', description: '섹션 ID' })
    @ApiBody({ type: CreateLectureDto })
    @ApiOkResponse({
        description: '강의 생성',
        type: LectureEntity,
    })
    createLecture(
        @Param('sectionId') sectionId: string,
        @Body() createLectureDto: CreateLectureDto,
        @Req() req: Request,
    ) {
        return this.lecturesService.createLecture(
            sectionId,
            createLectureDto,
            req.user?.sub ?? '',
        );
    }

    @Get(':lectureId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '강의 상세 조회' })
    @ApiParam({ name: 'lectureId', description: '강의 ID' })
    @ApiOkResponse({
        description: '강의 상세 정보',
        type: LectureEntity,
    })
    findOneLecture(@Param('lectureId') lectureId: string, @Req() req: Request) {
        return this.lecturesService.findOneLecture(
            lectureId,
            req.user?.sub ?? '',
        );
    }

    @Patch(':lectureId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '강의 업데이트' })
    @ApiParam({ name: 'lectureId', description: '강의 ID' })
    @ApiBody({ type: UpdateLectureDto })
    @ApiOkResponse({
        description: '강의 업데이트 성공',
        type: LectureEntity,
    })
    updateLecture(
        @Param('lectureId') lectureId: string,
        @Body() updateLectureDto: UpdateLectureDto,
        @Req() req: Request,
    ) {
        return this.lecturesService.updateLecture(
            lectureId,
            updateLectureDto,
            req.user?.sub ?? '',
        );
    }

    @Delete(':lectureId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '강의 삭제' })
    @ApiParam({ name: 'lectureId', description: '강의 ID' })
    @ApiOkResponse({
        description: '강의 삭제 성공',
        type: LectureEntity,
    })
    removeLecture(@Param('lectureId') lectureId: string, @Req() req: Request) {
        return this.lecturesService.removeLecture(
            lectureId,
            req.user?.sub ?? '',
        );
    }
}
