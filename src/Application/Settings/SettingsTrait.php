<?php

declare(strict_types=1);

namespace App\Application\Settings;

use App\Application\Settings\SettingsInterface;

trait SettingsTrait
{
    protected SettingsInterface $settings;

    protected function initSettings(SettingsInterface $settings)
    {
        $this->settings = $settings;
    }

    protected function getSetting(string $key)
    {
        return $this->settings->get($key);
    }
}
