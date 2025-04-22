<?php

declare(strict_types=1);

namespace App\Domain\LTI;

use App\Domain\LTI\LaunchDataRepositoryInterface;

trait LaunchDataTrait
{
    protected LaunchDataRepositoryInterface $launchData;

    public function initLaunchData(LaunchDataRepositoryInterface $launchData)
    {
        $this->launchData = $launchData;
    }

    public function getLaunchData()
    {
        return $this->launchData->getLaunchData();
    }
}
