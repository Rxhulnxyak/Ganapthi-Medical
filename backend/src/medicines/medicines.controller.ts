
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
    constructor(private readonly medicinesService: MedicinesService) { }

    @Get()
    findAll() {
        return this.medicinesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.medicinesService.findOne(id);
    }

    @Post()
    create(@Body() createMedicineDto: any) {
        return this.medicinesService.create(createMedicineDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMedicineDto: any) {
        return this.medicinesService.update(id, updateMedicineDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.medicinesService.remove(id);
    }
}
