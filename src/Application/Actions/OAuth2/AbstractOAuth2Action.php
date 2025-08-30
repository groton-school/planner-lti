<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use GrotonSchool\OAuth2\Client\Provider\CanvasLMS;
use GrotonSchool\Slim\Actions\AbstractAction;
use Odan\Session\SessionInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractOAuth2Action extends AbstractAction
{
    use UsersTrait;

    protected const STATE = self::class . '::state';

    public function __construct(
        SettingsInterface $settings,
        AppCredentialsRepositoryInterface $credentials,
        LaunchDataRepositoryInterface $launchData,
        protected SessionInterface $session,
        UserRepositoryInterface $users,
        protected LoggerInterface $logger,
        protected CanvasLMS $canvas
    ) {
        $this->initUsers($launchData, $users);
    }
}
