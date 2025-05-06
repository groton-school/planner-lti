<?php

declare(strict_types=1);

use App\Application\Settings\Settings;
use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Odan\Session\SessionInterface;

return function (ContainerBuilder $containerBuilder) {

    // Global Settings Object
    $containerBuilder->addDefinitions([
        SettingsInterface::class => function () {
            $TOOL_NAME = 'Planner LTI';
            $PROJECT_URL = 'https://' . getenv('HTTP_HOST');
            $SCOPES = ['https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly'];
            return new Settings([
                'displayErrorDetails' => false,
                'logError'            => true,
                'logErrorDetails'     => true,

                // get Google Cloud Project ID and URL from local environment
                Settings::PROJECT_ID => getenv('GOOGLE_CLOUD_PROJECT'),
                Settings::PROJECT_URL => $PROJECT_URL,
                Settings::TOOL_NAME => $TOOL_NAME,
                Settings::SCOPES => $SCOPES,
                Settings::CACHE_DURATION => 3600, // seconds
                Settings::REDIRECT_URI => "{$PROJECT_URL}/login/oauth2/redirect",
                Settings::TOOL_REGISTRATION => [
                    'application_type' => 'web',
                    'client_name' => $TOOL_NAME,
                    'client_uri' => $PROJECT_URL,
                    'grant_types' => ['client_credentials', 'implicit'],
                    'jwks_uri' => "{$PROJECT_URL}/lti/jwks",
                    'token_endpoint_auth_method' => 'private_key_jwt',
                    'initiate_login_uri' =>  "{$PROJECT_URL}/lti/login",
                    'redirect_uris' => ["{$PROJECT_URL}/lti/launch"],
                    'response_types' => ['id_token'],
                    "scope" => join(' ', $SCOPES),
                    'https://purl.imsglobal.org/spec/lti-tool-configuration' => [
                        'domain' => preg_replace('@^https?://@', '', $PROJECT_URL),
                        'target_link_uri' => "{$PROJECT_URL}/lti/launch",
                        'messages' => [
                            [
                                "type" => "LtiResourceLinkRequest",
                                "icon_uri" => "{$PROJECT_URL}/assets/icon.svg",
                                "label" => "Planner",
                                "custom_parameters" => [
                                    'user_id' => '$Canvas.user.id',
                                    'brand_config_json_url' => '$com.instructure.brandConfigJSON.url',
                                    'brand_config_js_url' => '$com.instructure.brandConfigJS.url',
                                    'common_css_url' => '$Canvas.css.common',
                                    'prefers_high_contrast' => '$Canvas.user.prefersHighContrast'
                                ],
                                "placements" => ["global_navigation"],
                                "roles" => [],
                                "target_link_uri" => "{$PROJECT_URL}/lti/launch?placement=global_navigation"
                            ]
                        ],
                        "claims" => [
                            "sub",
                            "iss",
                            "name",
                            "given_name",
                            "family_name",
                            "nickname",
                            "picture",
                            "email",
                            "locale"
                        ],
                        'https://canvas.instructure.com/lti/privacy_level' => 'public'

                    ]
                ],
                SessionInterface::class => [
                    'name' => "planner-session",
                    'lifetime' => 60 * 60 * 24,
                    'cookie_samesite' => 'None',
                    'secure' => true,
                    'httponly' => true
                ]
            ]);
        }
    ]);
};
