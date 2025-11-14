import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateLectureDto from './dto/create-lecture.dto';
import UpdateLectureDto from 'src/lectures/dto/update-lecture.dto';

@Injectable()
export class LecturesService {
    constructor(private readonly prisma: PrismaService) {}

    async createLecture(
        sectionId: string,
        createLectureDto: CreateLectureDto,
        userId: string,
    ) {
        const section = await this.prisma.section.findUnique({
            where: {
                id: sectionId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
            },
        });
        if (!section) {
            throw new NotFoundException(
                `Section with ID ${sectionId} not found`,
            );
        }
        if (section.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        const lastLecture = await this.prisma.lecture.findFirst({
            where: {
                sectionId,
            },
            orderBy: {
                order: 'desc',
            },
        });
        const order = lastLecture ? lastLecture.order + 1 : 0;
        return this.prisma.lecture.create({
            data: {
                ...createLectureDto,
                order,
                section: {
                    connect: {
                        id: sectionId,
                    },
                },
                course: {
                    connect: {
                        id: section.courseId,
                    },
                },
            },
        });
    }

    async updateLecture(
        lectureId: string,
        updateLectureDto: UpdateLectureDto,
        userId: string,
    ) {
        const lecture = await this.prisma.lecture.findUnique({
            where: {
                id: lectureId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
            },
        });
        if (!lecture) {
            throw new NotFoundException(
                `Lecture with ID ${lectureId} not found`,
            );
        }
        if (lecture.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }

        return this.prisma.lecture.update({
            where: {
                id: lectureId,
            },
            data: updateLectureDto,
        });
    }

    async findOneLecture(lectureId: string, userId: string) {
        const lecture = await this.prisma.lecture.findUnique({
            where: {
                id: lectureId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
            },
        });
        if (!lecture) {
            throw new NotFoundException(
                `Lecture with ID ${lectureId} not found`,
            );
        }
        if (lecture.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        return lecture;
    }

    async removeLecture(lectureId: string, userId: string) {
        const lecture = await this.prisma.lecture.findUnique({
            where: {
                id: lectureId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
            },
        });
        if (!lecture) {
            throw new NotFoundException(
                `Lecture with ID ${lectureId} not found`,
            );
        }
        if (lecture.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        await this.prisma.lecture.delete({
            where: { id: lectureId },
        });
        return lecture;
    }
}
