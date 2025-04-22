<?php

declare(strict_types=1);

namespace App\Application;

use Psr\Log\LoggerInterface;

trait LoggerTrait
{
    protected LoggerInterface $logger;

    public function initLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
