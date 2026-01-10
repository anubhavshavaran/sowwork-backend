import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from 'src/common/constants';
import { UserDocument } from 'src/user/schemas';
import { UserService } from 'src/user/user.service';
import { CreateArtistDto } from '../dto';
import { AddressDto, ArtistDescriptionDto } from 'src/user/dto';
import { Types } from 'mongoose';
import { OllamaEmbeddings } from '@langchain/ollama';
import { CategoryService } from './category.service';

@Injectable()
export class ArtistService {
  private readonly ollamaEmbeddings;

  constructor(
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly jwtService: JwtService,
  ) {
    this.ollamaEmbeddings = new OllamaEmbeddings({ model: 'nomic-embed-text:latest' });
  }

  async onboarding(artistData: CreateArtistDto): Promise<any | null> {
    try {
      const newArtist: UserDocument | null = await this.userService.createUser({
        firstName: artistData?.firstName,
        lastName: artistData?.lastName,
        email: artistData?.email,
        phoneNumber: artistData?.phoneNumber,
        userRole: UserRole.USER_ROLE_ARTIST,
        status: UserStatus.STATUS_ACTIVE,
      });

      const payload = { _id: newArtist?._id, userRole: newArtist?.userRole };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
      }
    } catch (error) {
      if (error?.errorResponse?.code === 11000) {
        throw new ForbiddenException(
          'An artist with this phone number already exists.'
        );
      } else {
        throw new ForbiddenException(
          error?.errorResponse?.errMsg || 'Something went wrong.'
        );
      }
    }
  }

  async addAddress(_id: Types.ObjectId, addAddress: AddressDto): Promise<any | null> {
    try {
      await this.userService.updateUser({ _id }, { address: addAddress });

      return {
        error: false,
        message: 'Address added successfully.',
      };
    } catch (error) {
      throw new ForbiddenException(
        error?.errorResponse?.errMsg || 'Something went wrong.'
      );
    }
  }

  async addDescription(_id: Types.ObjectId, description: ArtistDescriptionDto): Promise<any | null> {
    try {
      const user = await this.userService.findUser({ _id });
      const category = await this.categoryService.findCategory({ _id: description?.category });
      const specialization = await this.categoryService.findSpecialization({ _id: description?.specialization });

      const textToEmbed = `
      Name: ${user?.firstName} ${user?.lastName}
      Role: ${user?.userRole}
      User Description: ${user?.description}
      Category: ${category ? category.name : ''}
      Category Description: ${category ? category.description : ''}
      Specialization: ${specialization ? specialization.name : ''}
      Specialization Description: ${specialization ? specialization.description : ''}
      Per Hour Rate: ${user?.perHourRate}
      Location: ${user?.address?.city}, ${user?.address?.state}
      `.replace(/\n/g, " ");

      const vector = await this.ollamaEmbeddings.embedQuery(textToEmbed);

      await this.userService.updateUser({ _id }, {
        category: description?.category,
        specialization: description?.specialization,
        perHourRate: description?.perHourRate,
        description: description?.description,
        embedding: vector,
      });

      return {
        error: false,
        message: 'Description added successfully.',
      };
    } catch (error) {
      throw new ForbiddenException(
        error?.errorResponse?.errMsg || 'Something went wrong.'
      );
    }
  }

  async toggleWorkStatus(_id: Types.ObjectId, acceptWork: boolean): Promise<any | null> {
    try {
      await this.userService.updateUser({ _id }, { acceptWork });

      return {
        error: false,
        acceptWork,
      };
    } catch (error) {
      throw new ForbiddenException(
        error?.errorResponse?.errMsg || 'Something went wrong.'
      );
    }
  }
}
