<?php

declare(strict_types=1);

namespace App\Infrastructure\Session;

use Odan\Session\SessionInterface;

trait SessionTrait
{
    protected SessionInterface $session;

    public function initSession(SessionInterface $session)
    {
        $this->session = $session;
    }
}
