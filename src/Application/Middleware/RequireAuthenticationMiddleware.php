<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use App\Domain\LTI\LaunchData;
use GrotonSchool\Slim\LTI\Domain\User\UserRepositoryInterface;
use GrotonSchool\Slim\LTI\PartitionedSession\Handlers\LaunchHandler;
use Odan\Session\SessionInterface;
use Packback\Lti1p3\Interfaces\ICache;
use Packback\Lti1p3\Interfaces\ICookie;
use Packback\Lti1p3\Interfaces\IDatabase;
use Packback\Lti1p3\Interfaces\ILtiServiceConnector;
use Packback\Lti1p3\LtiMessageLaunch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Slim\Psr7\Response;
use Slim\Views\PhpRenderer;

class RequireAuthenticationMiddleware implements MiddlewareInterface
{
    public const USER = self::class . '::user';
    public const LAUNCH_MESSAGE = self::class . '::launchMessage';

    public function __construct(
        private ICache $cache,
        private IDatabase $database,
        private ICookie $cookie,
        private ILtiServiceConnector $serviceConnector,
        private SessionInterface $session,
        private UserRepositoryInterface $users,
        private PhpRenderer $views,
        private LoggerInterface $logger
    ) {
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $launch = new LaunchData(
            LtiMessageLaunch::fromCache(
                $this->session->get(LaunchHandler::LAUNCH_ID),
                $this->database,
                $this->cache,
                $this->cookie,
                $this->serviceConnector
            )->getLaunchData()
        );
        $user = $this->users->findUser(
            $launch->getConsumerInstanceHostname(),
            $launch->getUserId()
        );
        if ($user !== null) {
            return $handler->handle(
                $request
                    ->withAttribute(self::LAUNCH_MESSAGE, $launch)
                    ->withAttribute(self::USER, $user)
            );
        }
        return $this->views->render(new Response(), 'error.php', [
            'error' => '401: Unauthorized',
            'message' => 'You are not authorized to access this application.'
        ])->withStatus(401);
    }
}
