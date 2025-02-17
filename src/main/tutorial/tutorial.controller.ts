import { Controller } from '@nestjs/common';
import { TutorialService } from './tutorial.service';

@Controller('tutorial')
export class TutorialController {
    constructor(
        private readonly tutorialService: TutorialService,
    ){}
}
