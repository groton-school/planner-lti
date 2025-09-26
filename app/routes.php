<?php

declare(strict_types=1);

use App\Application\Actions\Authorized;
use App\Application\Actions\Canvas;
use App\Application\Actions\SPA;
use App\Application\Middleware\ApiProxyUserIdentifier;
use App\Application\Middleware\Authenticated;
use GrotonSchool\Slim\GAE;
use GrotonSchool\Slim\LTI;
use GrotonSchool\Slim\LTI\PartitionedSession;
use GrotonSchool\Slim\LTI\PartitionedSession\Middleware\PartitionedSessionMiddleware;
use Odan\Session\Middleware\SessionStartMiddleware;
use Slim\App;

return function (App $app) {
    (new GAE\RouteBuilder())->define($app);
    (new LTI\RouteBuilder())->define($app)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);
    (new PartitionedSession\RouteBuilder())->define($app);

    $app->getContainer()->get('routes.canvas')->define(
        $app,
        ApiProxyUserIdentifier::class,
        Authenticated::class
    )
        ->add(PartitionedSessionMiddleware::class);
    $app->get('/canvas/login/complete', Authorized::class);
    $app->get('/canvas/theme/stylesheet', Canvas\Theme\Stylesheet::class)
        ->add(Authenticated::class)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);

    $app->getContainer()->get('routes.google')->define(
        $app,
        ApiProxyUserIdentifier::class,
        Authenticated::class,
    )
        ->add(PartitionedSessionMiddleware::class);
    $app->get('/google/login/complete', Authorized::class);

    // app
    $app->get('/', SPA::class)
        ->add(Authenticated::class)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);
};
