import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LessonsController } from "./lessons.controller.js";
import { LessonsService } from "./lessons.service.js";
import { LessonsStore } from "./lessons.store.js";
import { createVisionProvider } from "./vision/vision.factory.js";
import { VISION_PROVIDER } from "./vision/vision-provider.interface.js";

@Module({
  controllers: [LessonsController],
  providers: [
    LessonsService,
    LessonsStore,
    {
      provide: VISION_PROVIDER,
      useFactory: createVisionProvider,
      inject: [ConfigService],
    },
  ],
  // Exported so the sessions module (B04) can read a stored lesson by id.
  exports: [LessonsStore],
})
export class LessonsModule {}
