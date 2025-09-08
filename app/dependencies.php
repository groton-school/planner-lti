<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use App\Application\Actions\Google\Calendar;
use Battis\LazySecrets;
use DI\ContainerBuilder;
use Google\Client;
use GrotonSchool\Slim\CanvasLMS;
use GrotonSchool\Slim\GAE;
use GrotonSchool\Slim\LTI;
use GrotonSchool\Slim\LTI\Actions\RegistrationConfigureActionInterface;
use GrotonSchool\Slim\LTI\Actions\RegistrationConfigurePassthruAction;
use GrotonSchool\Slim\LTI\Handlers\LaunchHandlerInterface;
use GrotonSchool\Slim\LTI\Infrastructure;
use GrotonSchool\Slim\LTI\PartitionedSession;
use GrotonSchool\Slim\LTI\PartitionedSession\Handlers\LaunchHandler;
use GrotonSchool\Slim\OAuth2\APIProxy\Domain\Provider\ProviderInterface;
use Odan\Session\PhpSession;
use Odan\Session\SessionInterface;
use Odan\Session\SessionManagerInterface;
use Psr\Container\ContainerInterface;
use Slim\Views\PhpRenderer;

return function (ContainerBuilder $containerBuilder) {
    GAE\Dependencies::inject($containerBuilder);
    LTI\Dependencies::inject($containerBuilder);
    PartitionedSession\Dependencies::inject($containerBuilder);
    Infrastructure\GAE\Dependencies::inject($containerBuilder);

    $containerBuilder->addDefinitions([
        // use default partitioned session settings
        PartitionedSession\SettingsInterface::class => DI\get(PartitionedSession\DefaultSettings::class),

        // all settings interfaces map to the App Settings
        GAE\SettingsInterface::class => DI\get(SettingsInterface::class),
        LTI\SettingsInterface::class => DI\get(SettingsInterface::class),
        Infrastructure\GAE\SettingsInterface::class => DI\get(SettingsInterface::class),
        Calendar\SettingsInterface::class => DI\get(SettingsInterface::class),

        LaunchHandlerInterface::class => DI\get(LaunchHandler::class),

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

        PhpRenderer::class => function (ContainerInterface $container) {
            /** @var SettingsInterface $settings */
            $settings = $container->get(SettingsInterface::class);
            $views = new PhpRenderer(__DIR__ . '/../views/slim', [
                'tool_name' => $settings->getToolName(),
                'title' => $settings->getToolName()
            ]);
            $views->setLayout('layout.php');
            return $views;
        },

        ProviderInterface::class => function (ContainerInterface $container) {
            /** @var SettingsInterface $settings */
            $settings = $container->get(SettingsInterface::class);
            $secrets = new LazySecrets\Cache();
            return new CanvasLMS\APIProxy([
                ...$secrets->get('CANVAS_CREDENTIALS'),
                'purpose' => $settings->getToolName()
            ]);
        }
    ]);
};
