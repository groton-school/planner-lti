<?php

declare(strict_types=1);

namespace App\Domain\OAuth2;

use App\Application\Actions\OAuth2\SettingsInterface;
use App\Application\Settings\SettingsTrait;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\LTI\LaunchDataTrait;
use GrotonSchool\OAuth2\Client\Provider\CanvasLMS;

trait OAuth2Trait
{
    use LaunchDataTrait, SettingsTrait;

    protected CanvasLMS $canvas;

    public function initOAuth2(
        SettingsInterface $settings,
        AppCredentialsRepositoryInterface $credentials,
        LaunchDataRepositoryInterface $launchData
    ) {
        $this->initSettings($settings);
        $this->initLaunchData($launchData);
        $this->canvas = new CanvasLMS(([
            'clientId' => $credentials->getClientID(),
            'clientSecret' => $credentials->getClientSecret(),
            'purpose' => "The planner needs access to Canvas so that it can see and update your assignments and to-do items.",
            'redirectUri' => $this->settings->getOAuth2RedirectUri(),
            'canvasInstanceUrl' =>  $this->launchData->getLaunchData()->getConsumerInstanceUrl()
        ]));
    }
}
