<?php

declare(strict_types=1);

namespace App\Domain\User;

use League\OAuth2\Client\Token\AccessToken;

class User
{
    private string $locator;
    private array $data;
    private bool $dirty = false;

    public function __construct(string $locator, array $data,)
    {
        $this->locator = $locator;
        $this->data = $data;
    }

    public function getLocator()
    {
        return $this->locator;
    }

    public function getId()
    {
        return $this->data['id'];
    }

    public function getTokens()
    {
        return new AccessToken($this->data['tokens']);
    }

    public function setTokens(AccessToken $tokens)
    {
        if (!$tokens->getRefreshToken() && $this->getTokens()->getRefreshToken()) {
            $tokens->setRefreshToken($this->getTokens()->getRefreshToken());
        }
        $this->data['tokens'] = $tokens->jsonSerialize();
        $this->dirty = true;
    }

    public function getData()
    {
        return $this->data;
    }

    public function isDirty()
    {
        return $this->dirty;
    }

    public function setDirty(bool $dirty)
    {
        $this->dirty = $dirty;
    }
}
