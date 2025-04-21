<?php

declare(strict_types=1);

namespace App\Domain\LTI;

interface LaunchDataRepositoryInterface
{
    public function saveLaunchData(LaunchData $lti);

    public function getLaunchData(): LaunchData;
}
