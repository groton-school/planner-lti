<?php

declare(strict_types=1);

namespace App\Application\Settings;

class Settings implements SettingsInterface
{
    public const PROJECT_ID = self::class . '::project_id';
    public const PROJECT_URL = self::class . '::project_url';
    public const TOOL_NAME = self::class . '::tool_name';
    public const LOGGER_NAME = self::class . '::logger_name';
    public const TOOL_URL = self::PROJECT_URL;
    public const TOOL_REGISTRATION = self::class . '::tool_registration';
    public const SCOPES = self::class . '::scopes';
    public const CACHE_DURATION = self::class . '::cache_duration';
    public const REDIRECT_URI = self::class . '::redirect_uri';
    public const LOG_REQUESTS = self::class . '::log_requests';
    public const CALENDAR_ID = self::class . '::calendar_id';

    private array $settings;

    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    public function getCacheDuration(): int
    {
        return $this->settings[self::CACHE_DURATION];
    }

    public function getCalendarId(): string
    {
        return $this->settings[self::CALENDAR_ID];
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

    public function getLoggerName(): string
    {
        return $this->settings[self::LOGGER_NAME];
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

    public function getOAuth2RedirectUri(): string
    {
        return $this->settings[self::REDIRECT_URI];
    }

    public function logRequests(): bool
    {
        return isset($this->settings[self::LOG_REQUESTS]) && $this->settings[self::LOG_REQUESTS];
    }
}
