<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\LTI\LaunchDataTrait;
use App\Domain\User\UserRepositoryInterface;

trait UsersTrait
{
    use LaunchDataTrait;

    protected UserRepositoryInterface $users;

    protected function initUsers(LaunchDataRepositoryInterface $launchData, UserRepositoryInterface $users)
    {
        $this->initLaunchData($launchData);
        $this->users = $users;
    }

    protected function getCurrentUser()
    {
        return $this->users->findUser(
            $this->getLaunchData()->getConsumerInstanceHostname(),
            $this->getLaunchData()->getUserId()
        );
    }
}
