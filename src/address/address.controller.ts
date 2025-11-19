import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { AuthGuard } from '../guards';
import { CurrentUser } from '../auth/decorators';
import { type UserDocument } from '../user/schemas';

@Controller('address')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('add-new')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: UserDocument,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(user._id.toString(), createAddressDto);
  }

  @Get('get-all-by-user-id')
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: UserDocument) {
    return this.addressService.findAll(user._id.toString());
  }

  @Get('get-by-id/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Post('update/:id')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Post('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
