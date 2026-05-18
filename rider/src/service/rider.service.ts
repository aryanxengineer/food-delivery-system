import { RiderRepository } from "../repository/rider.repository.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors.js";
import { uploadFile } from "../utils/uploadFile.js";
import { CreateRiderProfileType } from "../validator/rider.schema.js";

export class RiderService {
  constructor(private riderRepository: RiderRepository) {}

  addRiderProfile = async (
    riderId: string,
    profileData: CreateRiderProfileType,
    file: Express.Multer.File,
  ) => {
    const uploadResult = await uploadFile(file);
    const existingRiderProfile = await this.riderRepository.exists(riderId);

    if (existingRiderProfile)
      throw new ConflictError(
        "Rider profile already exists - Duplicate profile error",
      );

    const {
      phoneNumber,
      aadharNumber,
      drivingLicenseNumber,
      longitude,
      latitude,
    } = profileData;

    const newRiderProfile = await this.riderRepository.create({
      riderId,
      picture: uploadResult.url,
      phoneNumber,
      aadharNumber,
      drivingLicenseNumber,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      isAvailble: false,
      isVerified: false,
    });

    return newRiderProfile;
  };

  fetchMyProfile = async (riderId: string) => {
    const riderProfile = await this.riderRepository.findOne(riderId);
    if(!riderProfile) {
        throw new NotFoundError("Profile not found - Invalid riderId");
    }
    return riderProfile;
  }
}
