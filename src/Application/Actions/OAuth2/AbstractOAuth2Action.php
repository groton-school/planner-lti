<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

use App\Application\Actions\Action;
use App\Application\Settings\Settings;
use App\Domain\AppCredentials\AppCredentialsRepositoryInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use GrotonSchool\OAuth2\Client\Provider\CanvasLMS;
use Odan\Session\SessionInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractOAuth2Action extends Action
{
    protected const STATE = self::class . '::state';

    protected Settings $settings;
    protected CanvasLMS $canvas;
    protected AppCredentialsRepositoryInterface $credentials;
    protected UserRepositoryInterface $users;
    protected LaunchDataRepositoryInterface $launchData;
    protected SessionInterface $session;

    public function __construct(
        LoggerInterface $logger,
        SettingsInterface $settings,
        AppCredentialsRepositoryInterface $credentials,
        UserRepositoryInterface $users,
        LaunchDataRepositoryInterface $launchData,
        SessionInterface $session
    ) {
        parent::__construct($logger);
        $this->settings = $settings;
        $this->users = $users;
        $this->launchData = $launchData;
        $this->session = $session;
        $this->canvas = new CanvasLMS(([
            'clientId' => $credentials->getClientID(),
            'clientSecret' => $credentials->getClientSecret(),
            'purpose' => $this->settings->getToolName(),
            'redirectUri' => $this->settings->getOAuth2RedirectUri(),
            'canvasInstanceUrl' =>  $this->launchData->getLaunchData()->getConsumerInstanceUrl()
        ]));
    }
}
