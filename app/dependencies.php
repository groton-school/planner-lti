<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use App\Domain\Canvas;
use App\Domain\Google;
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
use GrotonSchool\Slim\OAuth2\APIProxy;
use GrotonSchool\Slim\OAuth2\APIProxy\GAE\Firestore\AccessTokenRepository;
use Odan\Session\PhpSession;
use Odan\Session\SessionInterface;
use Odan\Session\SessionManagerInterface;
use Slim\Views\PhpRenderer;

return function (ContainerBuilder $containerBuilder) {
    (new GAE\Dependencies())->inject($containerBuilder);
    (new LTI\Dependencies())->inject($containerBuilder);
    (new PartitionedSession\Dependencies())->inject($containerBuilder);
    (new Infrastructure\GAE\Dependencies())->inject($containerBuilder);

    $containerBuilder->addDefinitions([
        // use default partitioned session settings
        PartitionedSession\SettingsInterface::class => DI\get(PartitionedSession\DefaultSettings::class),

        // all settings interfaces map to the App Settings
        GAE\SettingsInterface::class => DI\get(SettingsInterface::class),
        LTI\SettingsInterface::class => DI\get(SettingsInterface::class),
        Infrastructure\GAE\SettingsInterface::class => DI\get(SettingsInterface::class),

        LaunchHandlerInterface::class => DI\get(LaunchHandler::class),

        RegistrationConfigureActionInterface::class => DI\autowire(RegistrationConfigurePassthruAction::class),

        SessionManagerInterface::class => DI\get(SessionInterface::class),
        SessionInterface::class => function (SettingsInterface $settings) {
            return new PhpSession($settings->getSessionConfig());
        },

        // Google API client
        Client::class => function () {
            $client = new Client();
            $client->useApplicationDefaultCredentials();
            return $client;
        },

        PhpRenderer::class => function (SettingsInterface $settings) {
            /** @var SettingsInterface $settings */
            $views = new PhpRenderer(__DIR__ . '/../views/slim', [
                'tool_name' => $settings->getToolName(),
                'title' => $settings->getToolName()
            ]);
            $views->setLayout('layout.php');
            return $views;
        },

        CanvasLMS\APIProxy::class => function (SettingsInterface $settings, SessionInterface $session, SessionManagerInterface $sessionManager) {
            $secrets = new LazySecrets\Cache();
            $canvasInstanceUrl = $_SERVER['HTTP_ORIGIN'] ?? null;
            if (!$sessionManager->isStarted()) {
                $sessionManager->start();
            }
            if ($canvasInstanceUrl) {
                $session->set('HTTP_ORIGIN', $canvasInstanceUrl);
            } else {
                $canvasInstanceUrl =  $session->get('HTTP_ORIGIN');
            }
            $proxy = new Canvas\APIProxy([
                ...$secrets->get('CANVAS_CREDENTIALS'),
                'canvasInstanceUrl' => $canvasInstanceUrl ?? '',
                'purpose' => $settings->getToolName()
            ]);
            $proxy->setAccessTokenRepostory(new AccessTokenRepository($proxy));
            $sessionManager->save();
            return $proxy;
        },

        'routes.canvas' => function (CanvasLMS\APIProxy $proxy, SessionInterface $session) {
            return new APIProxy\RouteBuilder($proxy, $session);
        },

        Google\APIProxy::class => function (SettingsInterface $settings) {
            $secrets = new LazySecrets\Cache();

            $proxy = new Google\APIProxy([
                ...$secrets->get('GOOGLE_CREDENTIALS'),
                'purpose' => $settings->getToolName()
            ]);
            $proxy->setAccessTokenRepostory(new AccessTokenRepository($proxy));
            return $proxy;
        },

        'routes.google' => function (Google\APIProxy $proxy, SessionInterface $session) {
            return new APIProxy\RouteBuilder($proxy, $session);
        }
    ]);
};
