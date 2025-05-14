<?php

declare(strict_types=1);

namespace App\Infrastructure\Session;

use App\Domain\LTI\LaunchData;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UnauthorizedException;
use Odan\Session\SessionInterface;

class SessionLaunchDataRepository implements LaunchDataRepositoryInterface
{
    private const LAUNCH_DATA = self::class . '::launch_data';

    private SessionInterface $session;

    public function __construct(SessionInterface $session)
    {
        $this->session = $session;
    }

    public function saveLaunchData(LaunchData $lti)
    {
        $this->session->set(
            self::LAUNCH_DATA,
            json_encode($lti)
        );
    }

    public function getLaunchData(): LaunchData
    {
        if ($this->session->get(self::LAUNCH_DATA) !== null) {
            return new LaunchData(
                json_decode(
                    $this->session->get(self::LAUNCH_DATA),
                    true
                )
            );
        }
        throw new UnauthorizedException('Launch data not present');
    }
}
