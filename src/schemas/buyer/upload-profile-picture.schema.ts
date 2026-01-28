// src/schemas/buyer/upload-profile-picture.schemats
import { z } from "zod";

export const UploadProfilePictureSchema = z.object({
    profilePicture: z.instanceof(File, { message: "No file provided! Upload a file." }),
});
export type UploadProfilePictureSchemaType = z.infer<typeof UploadProfilePictureSchema>;