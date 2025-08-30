<?php

declare(strict_types=1);

use App\Application\Actions\OAuth2;
use App\Application\Handlers\LaunchHandler;
use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Google\Client;
use Google\Cloud\Logging\LoggingClient;
use GrotonSchool\Slim\GAE;
use GrotonSchool\Slim\LTI;
use GrotonSchool\Slim\LTI\Actions\RegistrationConfigureActionInterface;
use GrotonSchool\Slim\LTI\Actions\RegistrationConfigurePassthruAction;
use GrotonSchool\Slim\LTI\Handlers\LaunchHandlerInterface;
use GrotonSchool\Slim\LTI\Infrastructure;
use GrotonSchool\Slim\LTI\Infrastructure\CacheInterface;
use GrotonSchool\Slim\LTI\Infrastructure\Cookie;
use GrotonSchool\Slim\LTI\Infrastructure\CookieInterface;
use GrotonSchool\Slim\LTI\Infrastructure\DatabaseInterface;
use GrotonSchool\Slim\LTI\Infrastructure\GAE\Cache;
use GrotonSchool\Slim\LTI\Infrastructure\GAE\Database;
use Odan\Session\PhpSession;
use Odan\Session\SessionInterface;
use Odan\Session\SessionManagerInterface;
use Packback\Lti1p3\Interfaces\ICache;
use Packback\Lti1p3\Interfaces\ICookie;
use Packback\Lti1p3\Interfaces\IDatabase;
use Packback\Lti1p3\Interfaces\ILtiServiceConnector;
use Packback\Lti1p3\LtiServiceConnector;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Slim\Views\PhpRenderer;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            /** @var SettingsInterface $settings */
            $settings = $c->get(SettingsInterface::class);
            $client = new LoggingClient([
                'projectId' => $settings->getProjectId()
            ]);
            $logger = $client->psrBatchLogger('slim-gae-skeleton');
            return $logger;
        },
        // all settings interfaces map to the App Settings
        GAE\SettingsInterface::class => DI\get(SettingsInterface::class),
        LTI\SettingsInterface::class => DI\get(SettingsInterface::class),
        Infrastructure\GAE\SettingsInterface::class => DI\get(SettingsInterface::class),
        OAuth2\SettingsInterface::class => DI\get(SettingsInterface::class),

        // autowire packbackbooks/lti-1p3-tool implementations
        ILtiServiceConnector::class => DI\autowire(LtiServiceConnector::class),
        ICookie::class => DI\autowire(Cookie::class),
        ICache::class => DI\autowire(Cache::class),
        IDatabase::class => DI\autowire(Database::class),

        // autowire groton-school/slim-lti-shim implementations
        CookieInterface::class => DI\autowire(Cookie::class),
        CacheInterface::class => DI\autowire(Cache::class),
        DatabaseInterface::class => DI\autowire(Database::class),
        LaunchHandlerInterface::class => DI\autowire(LaunchHandler::class),

        /*
        * autowire registration configuration passthru (no interactive
        * configuration)
        *
        * to set up interactive configurattion of the registration, implement
        * (and autowire) GrotonSchool\Slim\LTI\Actions\RegistrationConfigureActionInterface
        *
        * Interactive configuration ends either by invoking
        * GrotonSchool\Slim\LTI\Action\RegistrationCompleteAction::complete()
        * or by POSTing the complete registration (with the parameter name
        * registration) to an endpoint handled by
        * GrotonSchool\Slim\LTI\Action\RegistrationCompleteAction
        */
        RegistrationConfigureActionInterface::class => DI\autowire(RegistrationConfigurePassthruAction::class),

        SessionManagerInterface::class => DI\get(SessionInterface::class),
        SessionInterface::class => function (ContainerInterface $container) {
            $options = $container->get(SettingsInterface::class)->get(SessionInterface::class);
            return new PhpSession($options);
        },

        // Google API client
        Client::class => function () {
            $client = new Client();
            $client->useApplicationDefaultCredentials();
            return $client;
        },

        PhpRenderer::class => function () {
            return new PhpRenderer(__DIR__ . '/../views/slim');
        }
    ]);
};
