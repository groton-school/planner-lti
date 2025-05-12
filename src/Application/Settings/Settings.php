<?php

declare(strict_types=1);

namespace App\Application\Settings;


class Settings implements SettingsInterface
{
    public const PROJECT_ID = 'PROJECT_ID';
    public const PROJECT_URL = 'PROJECT_URL';
    public const TOOL_NAME = 'TOOL_NAME';
    public const TOOL_URL = self::PROJECT_URL;
    public const TOOL_REGISTRATION = 'TOOL_REGISTRATION';
    public const SCOPES = 'SCOPES';
    public const CACHE_DURATION = 'CACHE_DURATION';
    public const REDIRECT_URI = 'REDIRECT_URI';
    public const LOG_REQUESTS = 'LOG_REQUESTS';

    private array $settings;

    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @return mixed
     */
    public function get(string $key = '')
    {
        return (empty($key)) ? $this->settings : $this->settings[$key];
    }

    public function getProjectId(): string
    {
        return $this->settings[self::PROJECT_ID];
    }

    public function getProjectUrl(): string
    {
        return $this->settings[self::PROJECT_URL];
    }

    public function getToolName(): string
    {
        return $this->settings[self::TOOL_NAME];
    }

    public function getToolUrl(): string
    {
        return $this->settings[self::TOOL_URL];
    }

    public function getToolRegistration(): array
    {
        return $this->settings[self::TOOL_REGISTRATION];
    }

    /**
     * @return string[] 
     */
    public function getScopes(): array
    {
        return $this->settings[self::SCOPES];
    }

    public function getDuration(): int
    {
        return $this->settings[self::CACHE_DURATION];
    }

    public function getOAuth2RedirectUri(): string
    {
        return $this->settings[self::REDIRECT_URI];
    }

    public function logRequests(): bool
    {
        return isset($this->settings[self::LOG_REQUESTS]) && $this->settings[self::LOG_REQUESTS];
    }
}
