
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @Post()
    create(@Body() createPrescriptionDto: any) {
        return this.prescriptionsService.create(createPrescriptionDto);
    }

    @Get()
    findAll() {
        return this.prescriptionsService.findAll();
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.prescriptionsService.updateStatus(id, status);
    }
}
