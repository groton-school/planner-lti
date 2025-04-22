<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

use App\Application\Actions\AbstractAction;
use App\Application\LoggerTrait;
use App\Application\LoggingTrait;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\OAuth2\OAuth2Trait;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use App\Infrastructure\Session\SessionTrait;
use Odan\Session\SessionInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractOAuth2Action extends AbstractAction
{
    use OAuth2Trait, SessionTrait, UsersTrait, LoggerTrait;

    protected const STATE = self::class . '::state';

    public function __construct(
        SettingsInterface $settings,
        AppCredentialsRepositoryInterface $credentials,
        LaunchDataRepositoryInterface $launchData,
        SessionInterface $session,
        UserRepositoryInterface $users,
        LoggerInterface $logger
    ) {
        $this->initOAuth2($settings, $credentials, $launchData);
        $this->initSession($session);
        $this->initUsers($launchData, $users);
        $this->initLogger($logger);
    }
}
